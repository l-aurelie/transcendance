#.latest version  + alpine (+leger a retirer si ne fonctionne pas)
FROM node:lts-alpine

#.le directory dans le container
WORKDIR /usr/src/app

#.add `/app/node_modules/.bin` to $PATH what is that?
#.ENV PATH /app/node_modules/.bin:$PATH

#.PROD-- : installe les dependances, (ne marche que si pas de volume, sinon installer direct dans le volume)
##COPY package*.json ./
##RUN npm install
#.-----

#.copier toute l'app dans le workdir
COPY . .

#.DEV-MODE--
CMD ["npm", "start"]

#.PROD-MODE--
#.Behind the scenes, it uses babel to transpile your code and webpack as the build tool to bundle up your app.
##RUN npm  run build
##RUN   npm install -g serve
##CMD ["serve", "-s", "build"]




















#=============================================
# Old version
# FROM node:lts-alpine AS production

# RUN mkdir /build-dir
# WORKDIR /build-dir
# COPY package.json /build-dir
# COPY ./webpackDevServer.config.js /build-dir
# RUN npm install --location=global npm@8.15.0 && export npm_config_loglevel=silent && npm install --legacy-peer-deps && rm -rf /build-dir/node_modules/react-scripts/config/webpackDevServer.config.js \
#     && cp /build-dir/webpackDevServer.config.js /build-dir/node_modules/react-scripts/config/webpackDevServer.config.js

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# RUN ln -s /build-dir/node_modules node_modules
# COPY . /usr/src/app

# EXPOSE 4200