import { Response } from 'express';
export declare class AuthController {
    login(): void;
    redirection(res: Response): void;
    status(): string;
    logout(): void;
}
