#!/usr/bin/env python
import sys
from lstn import app as application

if __name__ == '__main__':
    port = application.config['PORT']
    if len(sys.argv) == 2:
      port = int(sys.argv[1])

    application.run(
        debug=application.config['DEBUG'],
        host=application.config['HOST'],
        port=port
    )
