#!/bin/bash

yum install -y lxc
yum install -y bridge-utils
yum install -y docker-io
yum install -y nginx

service cgconfig start
service docker start
