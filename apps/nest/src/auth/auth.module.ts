import { Module } from '@nestjs/common';
import { AuthController, createRandomUser, verifyCode} from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { IntraStrategy } from './strategies';
import { UsersModule } from '../users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Socket, User } from 'src/typeorm';
import { SessionSerializer } from './utils/Serializer';
import { HttpModule } from '@nestjs/axios';

import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SocketService, UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from 'src/chat/chat.gateway';
import { FriendRequest } from 'src/typeorm/entities/friend-request';


@Module({
  controllers: [AuthController, createRandomUser, verifyCode ],
  providers: [IntraStrategy, ChatGateway, /*we give our module access to our strategy*/
  SessionSerializer, AuthService, UsersService, SocketService,
  {
    /*we can now use authservice functions from auth.service.ts in our files by injecting AUTH_SERVICE*/
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  },
  
],
imports: [
  ConfigModule.forRoot({envFilePath: '.env'}),
<<<<<<< HEAD
  HttpModule, TypeOrmModule.forFeature([User, Socket]), UsersModule, //TypeOrmModule.forFeature([User]) permet d'acceder au donne de User dans la db
=======
  HttpModule, TypeOrmModule.forFeature([User, FriendRequest]), UsersModule, //TypeOrmModule.forFeature([User]) permet d'acceder au donne de User dans la db
>>>>>>> 421e018798707079300589754f7828cc55da3dff
    MailerModule.forRoot({ // donne des information pour l' envoi du mail pour le code de verification
        transport: {
        service: "gmail",
        secure: false,
        auth: {
          user: 'transcendance42@gmail.com',
          pass: process.env.GGL_SECRET,
        },
      },
      defaults: {
        from: '"No Reply" transcendance42@gmail.com',
      },
      template: {
        dir: join(__dirname, "../../views"),
        adapter: new HandlebarsAdapter(), 
        options: {
          strict: true,
        },
      },
    })]
})
export class AuthModule {}
