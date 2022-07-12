/*imports all entities, so we can just import this file into app module*/

import { User } from './entities/User';
import { TypeORMSession } from './entities/Session';
import {RoomEntity} from './entities/Room';
import { Socket } from './entities/Socket';
import { Message } from './entities/message';
import { Games } from './entities/Games';
import { RoomUser } from './entities/RoomUser';
import { UserBlock } from './entities/UserBlock';
<<<<<<< HEAD
=======
//import { Avatar } from './entities/Avatar';
>>>>>>> ff3deed4fb3b4d37a8d4a21bc7b4e11fd9d4f929

export const entities = [User, TypeORMSession, RoomEntity, Socket, Message, Games, RoomUser, UserBlock];

export { User, TypeORMSession, RoomEntity, Socket, Message, Games, RoomUser, UserBlock};
