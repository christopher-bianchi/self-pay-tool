# coding:utf-8
import csv, json, logging

from copy import deepcopy
from flask import Blueprint, jsonify, request


logger = logging.getLogger(__name__)
pay = Blueprint('pay', __name__, url_prefix='/pay')


@pay.route('/')
def hello_world():
    return 'Hello, World!'


@pay.route('/clients', methods=['GET'])
def get_clients():
    logger.info('index requested.')
    known_clients = _load_index()
    return jsonify(known_clients)


@pay.route('/daysheet', methods=['POST'])
def submit_daysheet():
    logger.info('daysheet submitted.')
    logger.debug(request.json)
    # accept a PUT
    # update the cache index
    # parse out a CSV
    # upload CSV to Google
    # email uploaded file

    # {
    #     "name": "foo",
    #     "dx_code": "F",
    #     "cpt_code": "",
    #     "insurance": "BCBS",
    #     "paid": "$5.00",
    #     "comments": ""
    # }
    known_clients = _load_index()
    _add_clients_to_index(known_clients, request.json)
    _save_index(known_clients)
    _write_daysheet(request.json)

    return jsonify('ok')


def _add_clients_to_index(known_clients, new_clients):
    logger.info('updating client index...')
    logger.debug('client index: {index}'.format(index=known_clients))
    logger.debug('new clients: {new}'.format(new=new_clients))

    for (client_name, client_info) in new_clients.items():
        logger.info('checking for: {name}'.format(name=client_name))

        if client_name in known_clients:
            known_clients[client_name].update(client_info)
        else:
            known_clients[client_name] = client_info


def _load_index():
    logger.info('loading client index...')
    try:
        with open('/app/client-index.json') as json_file:
            clients = json.load(json_file)
    except FileNotFoundError:
        logger.info('no index file present; setting an empty client index.')
        clients = {}

    return clients


def _save_index(client_data):
    logger.info('saving client index...')
    with open('/app/client-index.json', 'w+') as index:
        json.dump(client_data, index)


def _write_daysheet(daysheet):
    logger.info('writing csv...')
    header_keys = ['cpt_code',
                   'comments',
                   'dx_code',
                   'insurance',
                   'name',
                   'paid']

    with open('/tmp/daysheet.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=header_keys)
        writer.writeheader()
        for client in daysheet.values():
            writer.writerow(client)
