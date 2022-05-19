import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { IntraStrategy } from './strategies';
import { UsersModule } from '../users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { SessionSerializer } from './utils/Serializer';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  controllers: [AuthController],
  providers: [IntraStrategy, /*we give our module access to our strategy*/
  SessionSerializer, AuthService,
  {
    /*we can now use authservice functions from auth.service.ts in our files by injecting AUTH_SERVICE*/
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  },
  
],
imports: [HttpModule, TypeOrmModule.forFeature([User]),
UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule.forRoot({
        transport: {
        service: "gmail",
        secure: false,
        auth: {
          user: 'transcendance42@gmail.com',
          pass: '42transcendance!',
        },
      },
      defaults: {
        from: '"No Reply" transcendance42@gmail.com',
      },
      template: {
        dir: join(__dirname, "../../views/email-templates"),
        adapter: new HandlebarsAdapter(), 
        options: {
          strict: true,
        },
      },
    })]
})
export class AuthModule {}
