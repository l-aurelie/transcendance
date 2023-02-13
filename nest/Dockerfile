#.latest version  + alpine (+leger a retirer si ne fonctionne pas)
FROM node:lts-alpine

#.le directory dans le container
WORKDIR /usr/src/app

#.PROD-- : installe les dependances, (ne marche que si pas de volume, sinon npm install direct dans le volume)
##COPY package*.json ./
##RUN npm install
#-----

#.copier toute l'app dans le workdir
COPY . .

#.DEV-MODE--
#.lance mode dev (run le script dev de package.json)
CMD [ "npm", "run", "start:dev" ]

#.PROD-MODE--
#.compile dans dist(run le script build de package.json)
##RUN npm run build
#.lance le server en utilisant le main cree dans build (run le script prod de package.json)
##CMD ["npm", "run", "start:prod"]
#.(OU CMD ["node", "dist/main"])

EXPOSE 3000













#===================================
#Old version
# FROM node:lts-alpine AS production

# RUN mkdir /build-dir
# WORKDIR /build-dir
# COPY package.json /build-dir
# RUN npm install --location=global npm@8.15.0 && export npm_config_loglevel=silent && npm install --legacy-peer-deps

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# RUN ln -s /build-dir/node_modules node_modules
# COPY . /usr/src/app

# EXPOSE 3000
# CMD ["npm", "start"]
#====================================
# FROM node:lts-alpine AS development

# WORKDIR /src/app

# COPY package*.json ./

# RUN npm install --location=global npm@8.15.0 && export npm_config_loglevel=silent && npm install --legacy-peer-deps
# COPY . .

# RUN npm run build 

# EXPOSE 3000


## FROM node:lts-alpine AS production

## ARG NODE_ENV=production
## ENV NODE_ENV=${NODE_ENV}

## WORKDIR /src/app

## COPY --from=development /src/app/ .

## EXPOSE 3000