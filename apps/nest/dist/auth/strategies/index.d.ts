import { Profile } from 'passport-oauth2';
import { AuthenticationProvider } from '../services/auth/auth';
import { HttpService } from '@nestjs/axios';
declare const IntraStrategy_base: new (...args: any[]) => any;
export declare class IntraStrategy extends IntraStrategy_base {
    private httpService;
    private readonly authService;
    constructor(httpService: HttpService, authService: AuthenticationProvider);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
