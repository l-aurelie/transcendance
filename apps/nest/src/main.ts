import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepository } from 'typeorm';
import { AppModule } from './app.module';
import { TypeORMSession } from './typeorm/entities/Session';
import * as session from 'express-session';
import * as passport from 'passport';
import * as express from "express";
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const sessionRepo = getRepository(TypeORMSession);
  /*set up cookies so we remember users are logged in*/
  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      //used to encrypt cookie, can be anything but keep secret
      secret: 'askjhdkajshdkashd',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  //app.use('/mnt/nfs/homes/ssar/PROJECT/my_transcendance/apps/nest/src/views', express.static('/mnt/nfs/homes/ssar/PROJECT/my_transcendance/apps/nest/src/views/verify.hbs'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();