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

     async createRoom(idUser: number, isPrivate:boolean, isDm:boolean, nameRoom: string): Promise<IRoom> {
       // const newRoom = await this.addCreatorInRoom(room, creator);
       const room = {creatorId: idUser, private: isPrivate, directMessage: isDm, name: nameRoom};
       const does_exist = await this.roomRepo.findOne( {name: nameRoom} );
       console.log('does room exist ?', does_exist);
       return does_exist ? does_exist : this.roomRepo.save(room);
     }
    

 async associateUserRoom(room:IRoom, idUser: number, isPrivate:boolean, isDm:boolean, isAdmin:boolean) {
       // const newRoom = await this.addCreatorInRoom(room, creator);
      // const newRoom = await this.addCreatorInRoom(room, creator);
      let newuserRoom;
      if (isPrivate === false)
      {
      //  const theUser = await this.userServ.findUserById(idUser);
      //  const userRoom = {userId: idUser, user: theUser, roomId: room.id, isAdmin: isAdmin};
      //  newuserRoom = await this.roomUserRepo.save(userRoom);
        newuserRoom = await this.addAllUser(room, idUser);
      }
      else if (!isDm)
      {
        console.log('entre dans add creator');
        const theUser = await this.userServ.findUserById(idUser);
        const userRoom = {userId: idUser, user: theUser, roomId: room.id, isAdmin: isAdmin};
        newuserRoom = await this.roomUserRepo.save(userRoom);
      }
      return newuserRoom;
    }

    async addAllUser(room : IRoom, idCreator:number) {
      console.log('entre dans addAllUser');
      const allUser = await this.userServ.findAll();
      let idRoomCreate = 0;
      for (let entry of allUser) {
          
        const theUser = await this.userServ.findUserById(entry.id);
        let userRoom = {userId: entry.id, user: theUser, room: room, roomId: room.id};
        let newRoomUser = await this.roomUserRepo.save(userRoom);
        if (entry.id === idCreator)
          idRoomCreate = newRoomUser.id;
      }
        return (await this.roomUserRepo.findOne({id:idRoomCreate}));
    }

    async getRoomIdFromRoomName(name: string) {
      console.log(name);
      const retRoom = await this.roomRepo.findOne( {name: name} );
      console.log(retRoom);
      return retRoom ? retRoom.id : null;
    }

    async getRoomNameFromId(idRoom: number) {
      const retRoom = await this.roomRepo.findOne( {id: idRoom} );
      console.log(retRoom);
      return retRoom ? retRoom.name : null;
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