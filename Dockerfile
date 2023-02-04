FROM node:16

WORKDIR /src

COPY package*.json ./
COPY tsconfig*.json ./

EXPOSE 4000

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

RUN apt-get update && apt-get install -y wget

ENV REDIS_HOST redis

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz