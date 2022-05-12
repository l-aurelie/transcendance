import { Profile, Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AuthenticationProvider } from '../services/auth/auth';
import { HttpService } from '@nestjs/axios';
import { UserDetails } from '../utils/types';
import { userInfo } from 'os';

@Injectable()

/*IntraStrategy class provided to auth module for use*/
export class IntraStrategy extends PassportStrategy(Strategy, 'intra-oauth')
{
    /*we inject functions from auth.service.ts via auth_module*/
constructor(private httpService: HttpService, @Inject('AUTH_SERVICE') private readonly authService: AuthenticationProvider,
) {
    super({
        authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
        tokenURL: 'https://api.intra.42.fr/oauth/token',
        clientID: process.env.INTRA_CLIENT_ID,
        clientSecret: process.env.INTRA_CLIENT_SECRET,
        callbackURL: process.env.INTRA_CALLBACK_URL,
        /*possibly need to add scopes but no information on Intra API about scopes*/
    });
}

async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, discriminator, id: intraId, avatar } = profile;
    const { data } = await this.httpService.get('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
}).toPromise();
console.log(data.login);
console.log(accessToken);
    const details = { login: data.login , discriminator, intraId: data.id, avatar };
    console.log(details.login, details.discriminator, details.intraId, details.avatar);
    return this.authService.validateUser(details);

/*function will be called internally
async validate(accessToken: string) {
const { data } = await this.httpService
.get('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
}).toPromise();
console.log(data.login);
console.log(accessToken);

const { details } = { data.login, data.id, data.uid };
return this.authService.validateUser(details);
}*/
}
}