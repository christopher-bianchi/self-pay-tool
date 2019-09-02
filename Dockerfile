FROM node:12.8

MAINTAINER Christopher Bianchi

WORKDIR /usr/src/app

COPY app/ ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
