import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

/*laura*/
@Injectable()
/*calls Intra strategy class*/
export class IntraAuthGuard extends AuthGuard('intra-oauth') {
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
    //console.log('canActivate');
    console.log('authenticateGuard');
    const req = context.switchToHttp().getRequest();
    /*returns boolean if authenticated or not*/
    return req.isAuthenticated();
    }
}

@Catch(ForbiddenException)
export class redirToLogin implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    response.redirect('http://localhost:4200');
  }
}
