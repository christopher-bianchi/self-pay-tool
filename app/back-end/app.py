# coding:utf-8
import logging

from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r'/pay/*': {'origins': 'http://localhost:8080'}})

    logging.basicConfig(level=logging.DEBUG)

    from pay.pay import pay
    app.register_blueprint(pay)

    return app
