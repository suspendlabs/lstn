#!/usr/bin/env python
import os
import subprocess

def write_nginx_config(ip):
    fp = open('/etc/nginx/lstn.upstream.conf', 'w')
    fp.write('upstream lstn {\n')
    fp.write('  server ' + ip + ':80;\n')
    fp.write('}\n')
    fp.write('upstream socketio {\n')
    fp.write(' server ' + ip + ':3000;\n')
    fp.write(' keepalive 256;\n')
    fp.write('}')
    fp.close()

if __name__ == '__main__':
    # Path to the Dockerfile
    path = os.path.dirname(os.path.realpath(__file__))
    path += '/../'

    # Build the new image
    status = os.system("docker build -t lstn %s" % path)
    if status != 0:
        raise Exception('Failed to build docker image.')

    # Start the new container alongside the old ones we found above.
    cid = subprocess.Popen(['docker', 'run', '-d', 'lstn'], stdout=subprocess.PIPE).communicate()[0].strip()
    if not cid:
        raise Exception('Failed to create docker container')

    # Update the Nginx config on the Docker host.
    nginx_conf = path + 'config/docker-host-nginx.conf'
    os.system('cp %s /etc/nginx/conf.d/lstn.conf' % (nginx_conf))

    # Point Nginx to the new Docker container.
    ip_address = subprocess.Popen(['docker', 'inspect', '--format', "{{ .NetworkSettings.IPAddress }}", cid], stdout=subprocess.PIPE).communicate()[0].strip()
    if not ip_address:
        raise Exception('Failed to get docker container ip: %s')

    write_nginx_config(ip_address)

    # Reload Nginx
    output = subprocess.Popen(['service', 'nginx', 'status'], stdout=subprocess.PIPE).communicate()[0]
    if 'stopped' in output:
      os.system('service nginx start')
    else:
      os.system('service nginx reload')

    # Stop and remove old containers.
    containers = subprocess.Popen(['docker', 'ps'], stdout=subprocess.PIPE).communicate()[0].split("\n")[1:]
    for container in containers:
        columns = container.split()
        if len(columns) < 2:
            continue

        cid = columns[0]
        image = columns[1]

        if image == 'lstn:latest':
            continue

        os.system('docker stop %s' % cid)
        os.system('docker rm %s' % cid)
        os.system('docker rmi %s' % image)
