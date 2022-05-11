import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { IntraStrategy } from './strategies';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { SessionSerializer } from './utils/Serializer';

@Module({
  controllers: [AuthController],
  providers: [IntraStrategy, 
  SessionSerializer,
  {
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  },
  
],
imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
