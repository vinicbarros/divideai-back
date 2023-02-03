FROM node:16

WORKDIR /src

COPY package*.json ./
COPY ./tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=4000

EXPOSE 4000

RUN npm i -g bcrypt
RUN npm link bcrypt
RUN npx prisma generate
RUN apt-get update && apt-get install -y wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz