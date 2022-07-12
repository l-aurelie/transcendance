/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import {SocketService, UsersService} from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Socket, User, Games } from "src/typeorm";
import { FriendRequest } from "src/typeorm/entities/friend-request";
import { RoomUser } from '../typeorm/entities/RoomUser';
import { RoomEntity } from '../typeorm/entities/Room';
import { RoomService } from "src/chat/service/room.service";

@Module({
<<<<<<< HEAD
    imports: [TypeOrmModule.forFeature([User, Socket, FriendRequest, Games, RoomUser, RoomEntity])],
=======
    imports: [TypeOrmModule.forFeature([User, Socket, FriendRequest, Games,  RoomUser, RoomEntity])],
>>>>>>> ff3deed4fb3b4d37a8d4a21bc7b4e11fd9d4f929
    exports: [],
    controllers: [UsersController],
    providers: [UsersService, SocketService, RoomService],
})
export class UsersModule{

}