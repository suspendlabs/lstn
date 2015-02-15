#!/usr/bin/env python
import os
import json
import subprocess

from docker import Client

#from docker.utils import kwargs_from_env
#client = Client(**kwargs_from_env(assert_hostname=False))

client = Client(base_url='unix://var/run/docker.sock')

def build_image(path, tag):
    output = client.build(
        tag=tag,
        path=path,
        rm=True
    )
    stream = None
    for line in output:
        line   = json.loads(line)
        stream = line.get('stream')
        if stream:
            print stream

    if stream and 'Successfully built' not in stream:
        raise Exception('failed to get image id after build.')

    return stream.split()[-1]

def write_nginx_config(tag, ip, port=9000):
    upstream_name = tag.replace('/', '_').replace(':', '_')
    fp = open('/etc/nginx/' + upstream_name + '.upstream.conf', 'w')
    fp.write('upstream ' + upstream_name + ' {\n')
    fp.write('  server ' + ip + ':' + str(port) + ';\n')
    fp.write('}')
    fp.close()

if __name__ == '__main__':

    # Path to the Dockerfile
    path = os.path.dirname(os.path.realpath(__file__))
    path += '/../'

    tag = 'lstn'

    # Build the new image
    image = build_image(path, tag)

    # Start the new container alongside the old ones we found above.
    container = client.create_container(image=image, detach=True)
    client.start(container)

    # Update the Nginx config on the Docker host.
    nginx_conf = path + 'config/docker-host-nginx.conf'
    os.system('cp %s /etc/nginx/conf.d/lstn.conf' % (nginx_conf))

    # Point Nginx to the new Docker container.
    ip_address = client.inspect_container(container)['NetworkSettings']['IPAddress']
    write_nginx_config(tag, ip_address)

    # Reload Nginx
    output = subprocess.Popen(['service', 'nginx', 'status'], stdout=subprocess.PIPE).communicate()[0]
    if 'stopped' in output:
      os.system('service nginx start')
    else:
      os.system('service nginx reload')

    # Stop and remove old containers.
    for container in client.containers():
        if container['Image'] != tag + ':latest':
            client.stop(container)
            client.remove_container(container)
            client.remove_image(container['Image'])
