import { Body, Controller, Get, Post, Redirect, Render, Res, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import {Multer} from 'multer';
import {Express } from 'express';
import { DiscordAuthGuard, AuthenticatedGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
/*Define what happens at: localhost:3000/auth/login*/    
/*routes*/
    @Get('login') /*takes us to Intra login*/
    /*Page protected by authentification defined in DiscordAuthGuard*/
    @UseGuards(DiscordAuthGuard)
    login() {
        //on retourne quoi ?
        return;
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
    @UseGuards(DiscordAuthGuard)
   // @Render('verify')
   @Redirect('http://localhost:4200/Verify')
    VerifyEmail() {
    }

    @Post('/verify')
    //@UseInterceptors(FileInterceptor('verify'))
    async Verify(@Body() body, @Res() res) {
      try{
        const user = await this.userRepo.findOne({
          authConfirmToken: Number.parseInt(body.value),
        });
        if (!user) {
           //  res.redirect('/auth/verify');
             return false;
        }
        await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });
       // const welc = '/home/' + user.login;
       // res.sendStatus(200);
       // res.redirect(welc);
       return true;
      }catch(e){
         console.log('error catched...');
        return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
         }
}


@Get('logout')
logout(){}
}

@UseGuards(AuthenticatedGuard)
@Controller('home')
export class HomePage {
constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

@UseGuards(AuthenticatedGuard)
@Get('/:id')
welcome(@Param('id') id: string) {
    return (`Welcome ${id} !`);
}
}