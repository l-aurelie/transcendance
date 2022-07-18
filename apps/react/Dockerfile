FROM node:lts-alpine AS production

WORKDIR /react/src/app

COPY package*.json ./

RUN npm install --location=global npm@8.14.0 \
    && chown -R node:node /react \
    && export npm_config_loglevel=silent \
    && npm install --legacy-peer-deps
COPY . ./

USER node
EXPOSE 4200
