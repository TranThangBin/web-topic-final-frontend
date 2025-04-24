FROM node:23-alpine3.20
WORKDIR /frontend
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
