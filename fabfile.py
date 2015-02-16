import getpass
import requests
import json
import time
import sys
import os
from fabric.api import local
from fabric.context_managers import lcd, hide
from fabric.utils import abort
from fabric.colors import green, red

LOCAL_REPO = os.path.dirname(os.path.realpath(__file__))
BUILD_DIR  = '/tmp'

def __version():
    version = None
    with lcd(LOCAL_REPO):
        version = local('git rev-parse --short HEAD', capture = True)
    return version

def build():
    with lcd(LOCAL_REPO):
        version = __version()
        compressed = '%s.zip' % version

        print(green('building version %s' % version))

        # Copy codebase to the build path.
        archive = os.path.join(BUILD_DIR, version)
        local('rm -rf %s' % archive)
        #local('git archive %s --output=%s' % (version, archive))
        local('git checkout-index -f -a --prefix=%s/' % archive)

        local('cp %s/lstn/config.py %s/lstn/' % (LOCAL_REPO, archive))
        local('cp %s/socketio/production.json %s/socketio/config.json' % (LOCAL_REPO, archive))

        # Attempt to copy node modules
        node_modules_dir = LOCAL_REPO + '/node_modules'
        has_node_modules = False
        if os.path.isdir(node_modules_dir):
            local('cp -R %s %s/' % (node_modules_dir, archive))
            has_node_modules = True

        # Attempt to copy bower deps
        bower_path = '/lstn/static/bower_components'
        bower_deps_dir = LOCAL_REPO + bower_path
        has_bower_deps = False
        if os.path.isdir(bower_deps_dir):
            local('cp -R %s %s/' % (bower_deps_dir, archive + bower_path))
            has_bower_deps = True

    with lcd(archive):
        if not has_node_modules:
            local('npm install')

        if not has_bower_deps:
            local('bower install')

        local('grunt deploy')

        compressed = '%s.zip' % version
        local('zip -x "*.git*" -x "*node_modules*" -r ../%s *' % compressed)



    with lcd(BUILD_DIR):
        local('rm -rf %s' % version)

def deploy():
    version = __version()

    # Check that we have a build file.
    compressed = '%s.zip' % (version)
    if not os.path.isfile(os.path.join(BUILD_DIR, compressed)):
        abort(red('Build file not found. Did you forget to build?'))

    S3_BUCKET   = 'devops.lstn.fm'
    S3_KEY      = 'builds/lstn/' + compressed
    CD_APP_NAME = 'Lstn'
    CD_DEPLOYMENT_GROUP = 'Production'

    # Upload to S3
    with lcd(BUILD_DIR):
        local('aws s3 cp %s s3://%s/%s' % (compressed, S3_BUCKET, S3_KEY))
        local('rm -f %s' % (compressed))

        cmd = """aws deploy create-deployment \\
            --application-name "%s" \\
            --deployment-group-name "%s" \\
            --s3-location "bucket=%s,key=%s,bundleType=zip"
        """
        cmd = cmd % (CD_APP_NAME, CD_DEPLOYMENT_GROUP, S3_BUCKET, S3_KEY)
        res = json.loads(local(cmd, capture=True))
        deployment_id = res['deploymentId']

        print(green('Waiting for deployment status...'))
        cmd = """aws deploy get-deployment \\
            --deployment-id %s
        """

        # Print the status of the deployment.
        cmd = cmd % deployment_id
        old_status = None
        while True:
            with hide('running'):
                res = json.loads(local(cmd, capture=True))
            status = res['deploymentInfo']['status']
            if status != old_status:
                if old_status:
                    sys.stdout.write('\n')
                sys.stdout.write(status)
                old_status = status
            sys.stdout.write('.')
            sys.stdout.flush()
            if status == 'Succeeded':
                break
            time.sleep(1)

    print ''
    print(green('Done.'))
