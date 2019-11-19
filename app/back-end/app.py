# coding:utf-8
import logging, os

from collections import namedtuple
from flask import Flask
from flask_cors import CORS


logger = logging.getLogger(__name__)

ENV_VARIABLE_PREFIX = 'SELFPAY'
MailerCredentials = namedtuple('MailerCredentials', ['email', 'token'])


def create_app():
    """
    Factory method for our app.

    :return Flask: app
    """
    app = Flask(__name__)
    cors = CORS(app, resources={r'/pay/*': {'origins': 'http://localhost:8080'}})

    logging.basicConfig(level=logging.DEBUG)

    _load_settings_from_env(app)

    from pay.pay import pay
    app.register_blueprint(pay)

    return app


def _load_settings_from_env(app):
    logger.info('Loading settings from env...')

    for key, value in os.environ.items():
        if key.startswith(ENV_VARIABLE_PREFIX):
            app.config[key] = value

    _setup_mailer_credentials(app)


def _setup_mailer_credentials(app):
    app.mailer_creds = MailerCredentials(
        email=app.config['SELFPAY_MAILER_ACCOUNT_EMAIL'],
        token=app.config['SELFPAY_MAILER_ACCOUNT_TOKEN']
    )
