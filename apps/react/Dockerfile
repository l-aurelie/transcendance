FROM node:lts-alpine AS development

WORKDIR /react/src/app

COPY package*.json ./

# ENV PATH /react/src/app/node_modules/.bin:$PATH

RUN npm install

COPY . ./

EXPOSE 4200
