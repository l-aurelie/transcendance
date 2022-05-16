import { Body, Controller, Get, Post, Redirect, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { DiscordAuthGuard, AuthenticatedGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
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
    @Redirect('/auth/verify')
    redirection(@Res() res: Response) {
        
    }

    /*If we have authentifcated via login we can access this page*/
    /*check if user is logged in*/
    @UseGuards(AuthenticatedGuard)
    @Get('status')
    status() {
        /*should have an error page if not logged in*/
        return 'HELLLOOOO';
    }

    @Get('/verify')
    @Render('verify')
    VerifyEmail() {
    }

    @Post('/verify')
    async Verify(@Body() body) {
        console.log(body);
        try{
            const user = await this.userRepo.findOne({
              authConfirmToken: body
            });
            if (!user) {
              return new HttpException('Verification code has expired or not found', HttpStatus.UNAUTHORIZED)
            }
            await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });
            return true;
         }catch(e){
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
         }
         }


    @Get('logout')
    logout() {}
}
