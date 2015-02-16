#!/bin/bash

yum install -y lxc
yum install -y bridge-utils
yum install -y docker-io
yum install -y nginx
yum install -y python-pip

service cgconfig start
service docker start
