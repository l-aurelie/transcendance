/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import {SocketService, UsersService} from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Socket, User } from "src/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User, Socket])],
    exports: [],
    controllers: [UsersController],
    providers: [UsersService, SocketService],
})
export class UsersModule{

}