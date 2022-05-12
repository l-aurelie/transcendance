import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DiscordAuthGuard, AuthenticatedGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common'

@Controller('auth')
export class AuthController {
/*Define what happens at: localhost:3000/auth/login*/    
/*routes*/
    @Get('login') /*takes us to Intra login*/
    /*Page protected by authentification defined in DiscordAuthGuard*/
    @UseGuards(DiscordAuthGuard)
    login() {
        return;
    }

    /*Page we tell API to redirect to: localhost:3000/auth/redirect (although doesn't work with Intra)*/
    @Get('redirect')
    /*Page protected by authentification defined in DiscordAuthGuard*/
    @UseGuards(DiscordAuthGuard)
    redirection(@Res() res: Response) {
        res.sendStatus(200);
    }

    /*If we have authentifcated via login we can access this page*/
    /*check if user is logged in*/
    @UseGuards(AuthenticatedGuard)
    @Get('status')
    status() {
        /*should have an error page if not logged in*/
        return 'HELLLOOOO';
    }

    @Get('logout')
    logout() {}
}
