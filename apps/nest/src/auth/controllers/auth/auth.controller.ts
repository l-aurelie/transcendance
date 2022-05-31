/*laura samantha*/
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
import { AuthService } from 'src/auth/services/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('create')
export class createRandomUser {
    constructor(private readonly authService: AuthService) {} //le constructeur previent que la classe utilise AuthService (nest/src/auth/services/auth.service.ts)

    @Get()
    createRandomNew() { // fonction qui sera supprime par la suite, elle permet pour l' instant de creer des utilisateur random en tapant localhost:3000/create dans la bar url
      const num = Math.floor(10000 + Math.random() * 90000);
      const str = 'randomUser_' + num.toString();
      const details = {
        login: str,
        intraId: num.toString(),
        avatar: 'https://cdn.intra.42.fr/users/ssar.jpg',
        email: str + '@student.42.fr',
        authConfirmToken: undefined,
        isVerified:true,
        jwt: "falseJwtToken" + str,
        isConnected: false
       };
      this.authService.createUser(details);
    }
}

//ici sont place tout les controller lie a l'authentification
@Controller('auth')
export class AuthController {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private userServ : UsersService) {} //la classe utilise un repertoire de user et les usersServices
/*Define what happens at: localhost:3000/auth/login*/    
/*routes*/
    @Get('login') /*takes us to Intra login*/
    /*Page protected by authentification defined in DiscordAuthGuard -> redirect vers localhost:3000/verify*/ 
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
   @Redirect('http://localhost:4200/') //apres avoir fait localhost:3000/auth/login la class DiscordAuthGard appele dans le decorateur nous amene ici, pour l' instant il redirige simplement vers la page home de react situe a localhost:4200, le but plus tard est de renvoyer l'accessToken a react ?
    VerifyEmail() {
      /*  const user = this.userServ.findUserByJwt();
        const log = user.then(function(result){
           console.log(result);
           return result.login;
        })
      return log;
      */
     }
    

    @Post('/verify')
    async Verify(@Body() body, @Res() res) { // cette fonction servira quand on activera l'authentification avec le 2FA qui envoit des un code par mail pour verifier l'utilisateur, actuellement il est desactive pour eviter les spam demail et c'est mieux si c'est l' utilisateur qui choisi de l' activer ou non.
      try{
        const user = await this.userRepo.findOne({ // le formulaire renvoie dans le body le code donne par l'utilisateur, grace a cela on cherche si le code inscrit correspond au code stocker dans la base de donne et associe a un utilisateur
          authConfirmToken: Number.parseInt(body.value),
        });
        if (!user) { // si il n' y a pas de correspondance, le code entre n' est pas bon
             return false;
        }
        await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });// sinon on passe la mention isVerified de la db a true et le code a undefines puis en renvoie true
       return true;
      }catch(e){
         console.log('error catched...');
        return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
         }
}


@Get('logout')
logout(){}
}