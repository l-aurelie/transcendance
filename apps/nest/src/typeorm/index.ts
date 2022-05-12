/*imports all entities, so we can just import this file into app module*/

import { User } from './entities/User';
import { TypeORMSession } from './entities/Session';
export const entities = [User, TypeORMSession ];

export { User, TypeORMSession };