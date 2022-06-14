import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/typeorm/entities/Room';
import { Repository } from 'typeorm';
import { IRoom } from 'src/typeorm/entities/Room';
import { IRoomUser } from 'src/typeorm/entities/RoomUser';

import IUser, { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import '../chat.module';
import { RoomUser } from 'src/typeorm/entities/RoomUser';
//import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
@Injectable()
export class RoomService {
    constructor (
        @InjectRepository(RoomEntity) private readonly roomRepo : Repository<RoomEntity>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(RoomUser) private roomUserRepo: Repository<RoomUser>,
        private userServ : UsersService
     ) {}

     async createRoom(idUser: number, isPrivate:boolean, nameRoom: string): Promise<IRoom> {
       // const newRoom = await this.addCreatorInRoom(room, creator);
       const room = {creatorId: idUser, private: isPrivate, name: nameRoom};
       return this.roomRepo.save(room);
     }

 async associateUserRoom(room:IRoom, idUser: number, isPrivate:boolean) {
       // const newRoom = await this.addCreatorInRoom(room, creator);
      // const newRoom = await this.addCreatorInRoom(room, creator);
      if (isPrivate === false)
        this.addAllUser(room);
      else
      {
        console.log('entre dans add creator');
        const userRoom = {userId: idUser, roomId: room.id};
        this.roomUserRepo.save(userRoom);
      }
    }

    async addAllUser(room : IRoom) {
      console.log('entre dans addAllUser');
      const allUser = await this.userServ.findAll();
      for (let entry of allUser) {
        let userRoom = {userId: entry.id, roomId: room.id};
        this.roomUserRepo.save(userRoom)
      }
    }

    async getRoomIdFromRoomName(name: string) {
      console.log(name);
      const retRoom = await this.roomRepo.findOne( {name: name} );
      console.log(retRoom);
      return retRoom.id;
    }
     /*async getRoomsForUser(userId: number, options: IPaginationOptions) : Promise<Pagination<IRoom>> {
        const query = this.roomRepo
        .createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('user.id = :userId', {userId});

        return paginate(query, options);
     }

     async addCreatorInRoom(room : IRoom, creator: IUser): Promise<IRoom> {
      console.log('inaddCreator');
      console.log(creator.login); 
      const user : User = await this.userRepo.findOne({intraId:creator.intraId});
      console.log(user.login); 
      room.users = [];
      room.users.push(creator);
         return room;
     }
     */
}