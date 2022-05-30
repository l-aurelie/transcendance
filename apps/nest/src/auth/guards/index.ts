import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*laura*/
@Injectable()
/*calls Intra strategy class*/
export class DiscordAuthGuard extends AuthGuard('intra-oauth') {
    async canActivate(context: ExecutionContext): Promise<any> {
        console.log('AuthGuard');
        const activate = (await super.canActivate(context)) as boolean;
        console.log('activate  ');
        /*get request object*/
        const request = context.switchToHttp().getRequest();
        /*print out request in console*/
        console.log('request ' );
        /*call logIn function with request*/
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const req = context.switchToHttp().getRequest();
    /*returns boolean if authenticated or not*/
    return req.isAuthenticated();
    }
}