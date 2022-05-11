import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DiscordAuthGuard, AuthenticatedGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common'

@Controller('auth')
export class AuthController {
    
    @Get('login')
    @UseGuards(DiscordAuthGuard)
    login() {
        return;
    }

    @Get('redirect')
    //@UseGuards(DiscordAuthGuard)
    redirection(@Res() res: Response) {
        res.sendStatus(200);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('status')
    status() {
        return 'HELLLOOOO';
    }

    @Get('logout')
    logout() {}
}
