/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import {SocketService, UsersService} from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Socket, User, Games, Avatar } from "src/typeorm";
import { FriendRequest } from "src/typeorm/entities/friend-request";
import { RoomUser } from '../typeorm/entities/RoomUser';
import { RoomEntity } from '../typeorm/entities/Room';

@Module({
    imports: [TypeOrmModule.forFeature([User, Socket, FriendRequest, Games, Avatar, RoomUser, RoomEntity])],
    exports: [],
    controllers: [UsersController],
    providers: [UsersService, SocketService],
})
export class UsersModule{

}