import { Profile } from 'passport-oauth2';
import { AuthenticationProvider } from '../services/auth/auth';
declare const IntraStrategy_base: new (...args: any[]) => any;
export declare class IntraStrategy extends IntraStrategy_base {
    private readonly authService;
    constructor(authService: AuthenticationProvider);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
