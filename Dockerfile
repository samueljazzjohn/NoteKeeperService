FROM node:18.17.0

RUN yarn global add nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 80

CMD ["nodemon"]