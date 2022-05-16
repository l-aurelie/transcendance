import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { IntraStrategy } from './strategies';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { SessionSerializer } from './utils/Serializer';
import { HttpModule } from '@nestjs/axios';


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
imports: [HttpModule, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
