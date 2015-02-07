FROM ubuntu:14.04
MAINTAINER Suspend Labs

ENV DEBIAN_FRONTEND noninteractive

# Apt
RUN apt-get update --fix-missing

# Percona XtraDB
RUN apt-key adv --keyserver keys.gnupg.net --recv-keys 1C4CBDCDCD2EFD2A
RUN echo "deb http://repo.percona.com/apt trusty main" >> /etc/apt/sources.list
RUN echo "deb-src http://repo.percona.com/apt trusty main" >> /etc/apt/sources.list
RUN apt-get -y update
RUN apt-get -y install percona-server-server-5.5 percona-server-client-5.5

# Update the Bind Address
RUN sed -i -e"s/^bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/" /etc/mysql/my.cnf

EXPOSE 3306

VOLUME ["/etc/mysql", "/var/log/mysql", "/var/lib/mysql"]

CMD ["/opt/lstn/bin/mysql.sh"]
