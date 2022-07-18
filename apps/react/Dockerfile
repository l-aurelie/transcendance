FROM node:lts-alpine AS production

WORKDIR /react/src/app

COPY package*.json ./

RUN npm install --location=global npm@8.14.0 \
    && export npm_config_loglevel=silent \
    && npm install --legacy-peer-deps \
    && chown -R node:node /react/src/app/node_modules \
    && mkdir -p /react/src/app/node_modules/.cache \
     && chown -R node:node /react \
    && chown -R node:node /react/src/app/node_modules/.cache \
    && mkdir -p /react/src/app/node_modules/.cache/.eslintcache \
    && chown -R node:node /react/src/app/node_modules/.cache/.eslintcache
COPY . ./

EXPOSE 4200
