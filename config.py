import secrets


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + secrets.username + ':' + secrets.password + '@' \
                              + secrets.address
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SECRET_KEY = secrets.SECRET_KEY
    MAIL_SERVER = secrets.MAIL_SERVER
    MAIL_PORT = secrets.MAIL_PORT
    MAIL_USERNAME = secrets.MAIL_USERNAME
    MAIL_PASSWORD = secrets.MAIL_PASSWORD
    MAIL_USE_SSL = secrets.MAIL_USE_SSL
    MAIL_USE_TLS = secrets.MAIL_USE_TLS
    TEMPLATES_AUTO_RELOAD = True


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
