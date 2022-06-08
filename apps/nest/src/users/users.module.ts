/* aurel */
import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import {UsersService} from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { RoomEntity } from "src/chat/model/room.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule{

}