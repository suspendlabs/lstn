#!/bin/bash

yum install -y lxc
yum install -y bridge-utils
yum install -y docker-io
yum install -y nginx
yum install -y python-pip

pip install --upgrade six 
pip install docker-py==0.6.0

service cgconfig start
service docker start
