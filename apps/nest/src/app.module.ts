import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { entities } from './typeorm'
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersController } from './users/users.controller';
import { FriendsModule } from './friends/friends.module';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    /*session refers to cookie session*/
    PassportModule.register({ session: true }), 
    ConfigModule.forRoot({envFilePath: '.env'}),
    UsersModule, AuthModule, FriendsModule, StatsModule,
    TypeOrmModule.forRoot({
      /*configures TypeOrm to database*/
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      /*entities = typeorm database tables, all entities imported in typeorm/index.ts*/
      entities: entities,
      //url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize:true //suppress for production
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/*old code: @Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '../.env'}),
    TypeOrmModule.forRoot({
      type: 'postgres',
     // url: process.env.DATABASE_URL,
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true //suppress for production
    //  entities: [moduleEntity]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}*/
