FROM ubuntu:18.04

LABEL maintainer="Christopher Bianchi"

RUN apt-get update && \
    apt-get install -yy tar \
                        wget && \
    apt-get install -y python3 \
                       python3-dev \
                       python3-pip && \
    rm -rf /var/lib/apt/lists/*

COPY . /app/

WORKDIR /app
RUN pip3 install -r requirements.txt

ENV FLASK_APP app.py
ENV FLASK_ENV development
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
