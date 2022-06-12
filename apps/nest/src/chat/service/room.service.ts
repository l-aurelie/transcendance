import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/typeorm/entities/Room';
import { Repository } from 'typeorm';
import { IRoom } from 'src/typeorm/entities/Room';
import IUser, { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import '../chat.module';
//import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
@Injectable()
export class RoomService {
    constructor (
        @InjectRepository(RoomEntity) private readonly roomRepo : Repository<RoomEntity>,
        @InjectRepository(User) private readonly userRepo: Repository<User>
     ) {}

     async createRoom(room:IRoom, creator: IUser): Promise<IRoom> {
        const newRoom = await this.addCreatorInRoom(room, creator);
        return this.roomRepo.save(newRoom);
     }

     /*async getRoomsForUser(userId: number, options: IPaginationOptions) : Promise<Pagination<IRoom>> {
        const query = this.roomRepo
        .createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('user.id = :userId', {userId});

        return paginate(query, options);
     }
*/
     async addCreatorInRoom(room : IRoom, creator: IUser): Promise<IRoom> {
      console.log('inaddCreator');
      console.log(creator.login); 
      const user : User = await this.userRepo.findOne({intraId:creator.intraId});
      console.log(user.login); 
      room.users = [];
      room.users.push(creator);
         return room;
     }
}