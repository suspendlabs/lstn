class DefaultConfig(object):
    DEBUG = True
    PRODUCTION = False
    HOST = '0.0.0.0'
    PORT = 7000

    # SQLAlchemny
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://root:root@db/lstn'
    SQLALCHEMY_ECHO = False

    # Redis
    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    REDIS_DB = 0

    # Application Specific
    APP_NAME = 'lstn'
    BASE_URL = 'http://lstn.suspend.io'
    SECRET_KEY = 'af8d1d7f-369e-4ad2-b680-f7b27eac0d2d'

    # Google Settings
    GOOGLE_API_CLIENT_ID = '418649704145-jdls6etpc3hcudm5dq7kieh6fgrgc7i8.apps.googleusercontent.com'
    GOOGLE_API_CLIENT_SECRET = 'XwsqFcay5HNjFtlwCKHk2y_9'
    GOOGLE_API_SCOPE = 'openid email profile'

    # Rdio Settings
    RDIO_CONSUMER_KEY = '68mk8ffm373j8e3ynxs662wx'
    RDIO_CONSUMER_SECRET = 'vJ54QWjxWM'
