#!/usr/bin/env python
import urllib2
import boto
import os
import datetime

configs = {
  'default': 'lstn.config.DefaultConfig',
  'production': 'lstn.config.ProductionConfig'
}

env = 'default'
try:
  print 'Detecting if this is an ec2 instance...'
  instance_id = urllib2.urlopen('http://169.254.169.254/latest/meta-data/instance-id', timeout=5).read()
  ec2 = boto.connect_ec2()

  print 'Reading ec2 instance tags...'
  reservations = ec2.get_all_instances(instance_ids=[instance_id])
  tags = reservations[0].instances[0].tags
  env  = tags.get('lstn:environment', env)
  env  = 'production'
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
