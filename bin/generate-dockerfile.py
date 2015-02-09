#!/usr/bin/env python
import os
import json

path = os.path.dirname(os.path.realpath(__file__))

dockerfile_path   = path + '/../Dockerfile'
requirements_path = path + '/../requirements.txt'
package_path      = path + '/../package.json'

# Generate Dockerfile commands to install all the Python deps from the requirements file.
# We do this rather than call RUN pip install -r requirements.txt so that Docker can cache
# the pip installs.
installs = ''

# PIP
allow_external = ['python-dateutil']
allow_unverified = ['python-dateutil']

requirements = open(requirements_path).read().splitlines()
for requirement in requirements:
    name = requirement.split('==')[0]

    installs += 'RUN pip install '

    if name in allow_external:
        installs += '--allow-external %s ' % name

    if name in allow_unverified:
        installs += '--allow-unverified %s ' % name

    installs += "%s\n" % requirement

# NPM
with open(package_path, 'r') as package_file:
    data = json.loads(package_file.read())

if 'dependencies' in data:
    installs += "\n" + ''.join(["RUN npm install %s\n" % key for key in data['dependencies']])

# Base Dockerfile
dockerfile = """FROM ubuntu:14.04
MAINTAINER Suspend Labs

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update
RUN apt-get -y install \\
    python \\
    python-dev \\
    python-distribute \\
    python-pip \\
    nginx \\
    supervisor \\
    libmysqlclient-dev \\
    nodejs \\
    npm

RUN pip install uwsgi

%s

ADD . /opt/lstn
RUN python /opt/lstn/bin/build.py

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ADD config/nginx.conf /etc/nginx/sites-available/default

ADD config/uwsgi.ini /etc/uwsgi.ini
ADD config/supervisord.conf /etc/supervisor/supervisord.conf

EXPOSE 80 443 7000 3000
CMD ["/usr/bin/supervisord"]
"""

dockerfile = dockerfile % installs

fp = open(dockerfile_path, 'w')
fp.write(dockerfile)
fp.close()
