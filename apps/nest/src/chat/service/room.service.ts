import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/model/room.entity';
import { Repository } from 'typeorm';
import { IRoom } from 'src/chat/model/room.interface';
import IUser from 'src/typeorm/entities/User';
//import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
@Injectable()
export class RoomService {
    constructor (
        @InjectRepository(RoomEntity)
        private readonly roomRepo : Repository<RoomEntity>
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
         room.users.push(creator);
         return room;
     }
}