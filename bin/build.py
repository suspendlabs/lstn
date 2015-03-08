#!/usr/bin/env python
import urllib2
import boto
import boto.ec2.autoscale
import os
import datetime

configs = {
  'default': 'lstn.config.DefaultConfig',
  'beta': 'lstn.config.BetaConfig',
  'production': 'lstn.config.ProductionConfig',
}

env = 'default'
try:
  print 'Detecting if this is an ec2 instance...'
  instance_id = urllib2.urlopen('http://169.254.169.254/latest/meta-data/instance-id', timeout=5).read()
  autoscale = boto.ec2.autoscale.connect_to_region('us-west-2')

  print 'Reading autoscaling groups...'
  groups = autoscale.get_all_groups(names=['Lstn'])

  if groups:
    print 'Found autoscale group'
    group = groups[0]

    if group.tags:
      print 'Reading autoscale group tags...'
      tag = group.tags[0]

      if tag.key == 'lstn:environment':
        print 'Found environment tag'
        env = tag.value
except:
  pass

print "Environment detected as '%s'." % (env)
print 'Writing local.py...'

filepath = os.path.dirname(os.path.realpath(__file__)) + '/../lstn/local.py'
fp = open(filepath, 'w')
fp.write("# This file was auto-generated on %s by build.py\n" % datetime.datetime.now())
fp.write("LSTN_CONFIG = '%s'" % configs.get(env or 'default'))
fp.close()

print 'Done.'
