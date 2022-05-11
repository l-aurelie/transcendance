import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { UserDetails } from '../../utils/types';
import { AuthenticationProvider } from './auth';
export declare class AuthService implements AuthenticationProvider {
    private userRepo;
    constructor(userRepo: Repository<User>);
    validateUser(details: UserDetails): Promise<User>;
    createUser(details: UserDetails): Promise<User>;
    findUser(discordId: string): Promise<User>;
}
