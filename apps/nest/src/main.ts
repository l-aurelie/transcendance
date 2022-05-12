import { NestFactory } from '@nestjs/core';
import { getRepository } from 'typeorm';
import { AppModule } from './app.module';
import { TypeORMSession } from './typeorm/entities/Session';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(3000);
}
bootstrap();