/*imports all entities, so we can just import this file into app module*/

import { User } from './entities/User';
import { TypeORMSession } from './entities/Session';
import { RoomEntity } from 'src/chat/model/room.entity';
import { Socket } from './entities/Socket';
export const entities = [User, TypeORMSession, RoomEntity, Socket];

export { User, TypeORMSession, RoomEntity, Socket };