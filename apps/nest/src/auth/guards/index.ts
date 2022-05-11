import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('intra-oauth') {
    async canActivate(context: ExecutionContext): Promise<any> {
        const activate = (await super.canActivate(context)) as boolean;
        console.log(activate);
        const request = context.switchToHttp().getRequest();
        console.log(request);
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated();
    }
}