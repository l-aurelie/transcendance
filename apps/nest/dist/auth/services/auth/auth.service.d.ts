import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { UserDetails } from '../../utils/types';
import { AuthenticationProvider } from './auth';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService implements AuthenticationProvider {
    private userRepo;
    private mailerService;
    private code;
    constructor(userRepo: Repository<User>, mailerService: MailerService);
    signin(user: User, jwt: JwtService): Promise<any>;
    validateUser(details: UserDetails, newCode: Number): Promise<User>;
    createUser(details: UserDetails): Promise<User>;
    findUser(intraId: string): Promise<User>;
    sendCode(user: User, newCode: Number): Promise<void>;
}
