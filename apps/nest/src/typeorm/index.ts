/*imports all entities, so we can just import this file into app module*/

import { User } from './entities/User';
import { TypeORMSession } from './entities/Session';
import { RoomEntity } from 'src/chat/model/room.entity';
export const entities = [User, TypeORMSession, RoomEntity ];

export { User, TypeORMSession, RoomEntity };