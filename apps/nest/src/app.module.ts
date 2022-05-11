import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
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
export class AppModule {}
