/*imports all entities, so we can just import this file into app module*/

import { User } from './entities/User';
import { TypeORMSession } from './entities/Session';
import {RoomEntity} from './entities/Room';
import { Socket } from './entities/Socket';
import { Message } from './entities/message';
export const entities = [User, TypeORMSession, RoomEntity, Socket, Message];

export { User, TypeORMSession, RoomEntity, Socket, Message };