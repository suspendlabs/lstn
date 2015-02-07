#!/bin/bash
if [ ! -d /var/lib/mysql ]; then
  echo "Creating MySQL data directory"
  mkdir -p /var/lib/mysql
fi

if [ ! -f /var/lib/mysql/ibdata1 ]; then
  echo "Initializing MySQL Database"
  chown -R mysql /var/lib/mysql
  mysql_install_db
fi

echo "Starting MySQL server..."
mysqld_safe &
MYSQL_PID=$!

if [ ! -d /var/lib/mysql/lstn ]; then
  mysqladmin --silent --wait=30 ping || exit 1

  echo "Creating lstn DB"
  mysqladmin create lstn

  echo "Setting root password"
  mysqladmin -u root password "root"

  echo "Setting up root user"
  mysql -u root -proot lstn < /opt/lstn/setup.sql
fi

echo "Server running."
wait $MYSQL_PID
