# coding:utf-8
import csv, json, logging, smtplib

from copy import deepcopy
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import (Blueprint,
                   current_app,
                   jsonify,
                   request)
from jinja2 import Environment, FileSystemLoader


logger = logging.getLogger(__name__)
pay = Blueprint('pay', __name__, url_prefix='/pay')

EMAIL_TEMPLATE = 'daysheet.html'


@pay.route('/clients', methods=['GET'])
def get_clients():
    logger.info('index requested.')
    known_clients = _load_index()
    return jsonify(known_clients)


@pay.route('/daysheet', methods=['POST'])
def submit_daysheet():
    logger.info('daysheet submitted.')
    logger.debug(request.json)

    # "foo": {
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
    _email_daysheet(request.json)

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
    """
    Write the Client JSON to disk.
    """
    logger.info('saving client index...')
    with open('/app/client-index.json', 'w+') as index:
        json.dump(client_data, index)


def _write_daysheet(daysheet):
    """
    Write the Daysheet CSV to disk.
    """
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


def _email_daysheet(daysheet):
    """
    Opens an SMTP connection, logs in our mailer account and emails the
    daysheet.
    """
    logger.info('Logging into gmail account...')

    with smtplib.SMTP('smtp.gmail.com', 587) as email_conn:
        email_conn.starttls()
        email_conn.login(current_app.mailer_creds.email,
                         current_app.mailer_creds.token)
        _send_email(email_conn,
                    current_app.mailer_creds.email,
                    current_app.config['SELFPAY_RECIPIENT_EMAIL'],
                    current_app.config['SELFPAY_CLINICIAN_NAME'],
                    daysheet)


def _create_daysheet_email(daysheet, signoff_name, date_of_service):
    """
    Build the email HTML body for the Daysheet.
    """
    env = Environment(loader=FileSystemLoader('/app/pay/templates'))
    template = env.get_template(EMAIL_TEMPLATE)
    email = template.render(daysheet=daysheet,
                            signoff_name=signoff_name,
                            date_of_service=date_of_service)

    return email


def _send_email(conn, sender, recipient, signoff_name, daysheet):
    """
    Send an email to inform our secret santa who they will be gifting.

    :param conn: the connection to the email server.
    """
    logger.info('Sending daysheet to: {to}'.format(to=recipient))

    today = datetime.now()
    date_of_service = today.strftime('%m/%d/%Y')
    email_body = _create_daysheet_email(daysheet, signoff_name, date_of_service)

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = 'Daysheet {date}'.format(date=date_of_service)

    message.attach(MIMEText(email_body, 'html'))


    # sheet = '/tmp/daysheet.csv'
    # sheetname = 'Daysheet {year}-{month}-{day}.csv'.format(
    #     year=today.year,
    #     month=today.month,
    #     day=today.day,
    # )
    # with open(sheet) as file:
    #     attachment = MIMEText(file.read())
    #     attachment.add_header('Content-Disposition', 'attachment', filename=sheetname)
    #     message.attach(attachment)

    conn.sendmail(sender, [recipient], message.as_string())
