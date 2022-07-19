FROM node:lts-alpine AS production

WORKDIR /react/src/app

COPY package*.json ./
COPY ./webpackDevServer.config.js ./

RUN npm install --location=global npm@8.14.0 \
    && chown -R node:node /react \
    && export npm_config_loglevel=silent \
    && npm install --legacy-peer-deps \
    && rm -rf /react/src/app/node_modules/react-scripts/config/webpackDevServer.config.js \
    && cp /react/src/app/webpackDevServer.config.js /react/src/app/node_modules/react-scripts/config/webpackDevServer.config.js

COPY . ./


USER node
EXPOSE 4200
