import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { HttpException } from '@nestjs/common';
export declare class AuthController {
    private userRepo;
    constructor(userRepo: Repository<User>);
    login(): void;
    redirection(res: Response): void;
    status(): string;
    VerifyEmail(): void;
    Verify(body: any): Promise<true | HttpException>;
    logout(): void;
}
