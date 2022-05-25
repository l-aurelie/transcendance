import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { HttpException } from '@nestjs/common';
export declare class AuthController {
    private userRepo;
    constructor(userRepo: Repository<User>);
    login(): void;
    status(): string;
    VerifyEmail(): void;
    Verify(body: any, res: any): Promise<boolean | HttpException>;
    logout(): void;
}
export declare class HomePage {
    private userRepo;
    constructor(userRepo: Repository<User>);
    welcome(id: string): string;
}
