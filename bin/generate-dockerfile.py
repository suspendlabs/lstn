#!/usr/bin/env python
import os

path = os.path.dirname(os.path.realpath(__file__))

dockerfile_path   = path + '/../Dockerfile'
requirements_path = path + '/../requirements.txt'

# Generate Dockerfile commands to install all the Python deps from the requirements file.
# We do this rather than call RUN pip install -r requirements.txt so that Docker can cache
# the pip installs.
fp = open(requirements_path, 'r')
requirement_installs  = ''.join(['RUN pip install %s' % line for line in fp])
fp.close()

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
    libmysqlclient-dev

RUN pip install uwsgi

%s

ADD . /opt/lstn
RUN python /opt/lstn/bin/build.py

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ADD config/nginx.conf /etc/nginx/sites-available/default

ADD config/uwsgi.ini /etc/uwsgi.ini
ADD config/supervisord.conf /etc/supervisord.conf

EXPOSE 80 443 9000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
"""

dockerfile = dockerfile % requirement_installs

fp = open(dockerfile_path, 'w')
fp.write(dockerfile)
fp.close()
