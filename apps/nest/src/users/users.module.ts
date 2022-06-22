/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import {SocketService, UsersService} from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Socket, User, Games } from "src/typeorm";
import { FriendRequest } from "src/typeorm/entities/friend-request";

@Module({
    imports: [TypeOrmModule.forFeature([User, Socket, FriendRequest, Games])],
    exports: [],
    controllers: [UsersController],
    providers: [UsersService, SocketService],
})
export class UsersModule{

}