import { Profile, Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AuthenticationProvider } from '../services/auth/auth';

@Injectable()

/*IntraStrategy class provided to auth module for use*/
export class IntraStrategy extends PassportStrategy(Strategy, 'intra-oauth')
{
    /*we inject functions from auth.service.ts via auth_module*/
constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthenticationProvider,
) {
    super({
        authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
        tokenURL: 'https://api.intra.42.fr/oauth/token',
        clientID: process.env.INTRA_CLIENT_ID,
        clientSecret: process.env.INTRA_CLIENT_SECRET,
        callbackURL: process.env.INTRA_CALLBACK_URL + '/api/v1/auth/login/intra',
        /*possibly need to add scopes but no information on Intra API about scopes*/
    });
}

/*function will be called internally*/
async validate(accessToken: string, refreshToken: string, profile: Profile) {
const { username, discriminator, id: discordId, avatar } = profile;
console.log(username, discriminator, discordId, avatar);
const details = { username, discriminator, discordId, avatar };
return this.authService.validateUser(details);
}
}