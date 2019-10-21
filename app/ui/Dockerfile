FROM node:12.8

LABEL maintainer="Christopher Bianchi"

COPY . /usr/src/app/

WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
