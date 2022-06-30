/*laura samantha*/
import { Body, Controller, Get, Post, Response ,Header, Res, Param, Req } from '@nestjs/common';

import { IntraAuthGuard, AuthenticatedGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from 'src/auth/services/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';

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
        isConnected: false
       };
      this.authService.createUser(details);
    }
    /* localhost:3000/create/<nomSouhaite>, ajoute a la table un user appele <nomSouhaite> */
    @Get(':login')
    createNe(@Param() params) {
      const details = {
        login: params.login,
        intraId: params.login,
        avatar: 'https://cdn.intra.42.fr/users/ssar.jpg',
        email: params.login + '@student.42.fr',
        authConfirmToken: undefined,
        isVerified:true,
        isConnected: false
       };
      this.authService.createUser(details);
    }
}
@Controller('verify')
export class verifyCode {
    constructor(@InjectRepository(User) private userRepo:Repository<User>) {} //le constructeur previent que la classe utilise AuthService (nest/src/auth/services/auth.service.ts)

    @UseGuards(AuthenticatedGuard)
    @Header('Access-Control-Allow-Origin', 'http://localhost:4200')
    @Post()
    
    async Verify(@Body() body, @Res() res) { // cette fonction servira quand on activera l'authentification avec le 2FA qui envoit des un code par mail pour verifier l'utilisateur, actuellement il est desactive pour eviter les spam demail et c'est mieux si c'est l' utilisateur qui choisi de l' activer ou non.
    try{
      console.log('enter verify');
        const user = await this.userRepo.findOne({ // le formulaire renvoie dans le body le code donne par l'utilisateur, grace a cela on cherche si le code inscrit correspond au code stocker dans la base de donne et associe a un utilisateur
        where : { authConfirmToken: Number.parseInt(body.value), },
        });
        if (!user) { // si il n' y a pas de correspondance, le code entre n' est pas bon
          console.log('fail verify');
          res.status(304);
          res.send('Unauthorized');
          //return res.HttpStatus.UNAUTHORIZED;
          //throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });// sinon on passe la mention isVerified de la db a true et le code a undefines puis en renvoie true
        console.log('sucess verify');
        res.status(200);
        res.send('Ok');
        //return res.HttpStatus.OK;
        //throw new HttpException('Ok', HttpStatus.OK);
      } catch(e){
         console.log('error catched...');
         console.log(e);
        return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
//ici sont place tout les controller lie a l'authentification
@Controller('auth')
export class AuthController {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private userServ : UsersService) {} //la classe utilise un repertoire de user et les usersServices
/*Define what happens at: localhost:3000/auth/login*/    
/*routes*/
    @Get('login') /*takes us to Intra login*/
    /*Page protected by authentification defined in IntradAuthGuard -> redirect vers localhost:3000/verify*/ 
    @UseGuards(IntraAuthGuard)
 //   @Redirect('http://localhost:4200/Home')
    async login(@Req() request: RequestWithUser, @Response() res) {
   //  console.log(request.user);
        //on retourne quoi ?
     //   return {login:"yoooooooo"};
     if (request.user.twoFA === true && request.user.isVerified === false && request.user.isConnected === false)
        res.redirect('http://localhost:4200/Verify');
      else
        res.redirect('http://localhost:4200/Home');
      await this.userRepo.update( { id:request.user.id }, {isConnected:true});
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
    @UseGuards(IntraAuthGuard)
   // @Render('verify')
   //@Redirect('http://localhost:4200/') //apres avoir fait localhost:3000/auth/login la class IntraAuthGard appele dans le decorateur nous amene ici, pour l' instant il redirige simplement vers la page home de react situe a localhost:4200, le but plus tard est de renvoyer l'accessToken a react ?
    VerifyEmail() {
     console.log ('coucou');
     }
    

    @Post('/verify')
    async Verify(@Body() body, @Res() res) { // cette fonction servira quand on activera l'authentification avec le 2FA qui envoit des un code par mail pour verifier l'utilisateur, actuellement il est desactive pour eviter les spam demail et c'est mieux si c'est l' utilisateur qui choisi de l' activer ou non.
      try{
        const user = await this.userRepo.findOne({ // le formulaire renvoie dans le body le code donne par l'utilisateur, grace a cela on cherche si le code inscrit correspond au code stocker dans la base de donne et associe a un utilisateur
        where : { authConfirmToken: Number.parseInt(body.value), },
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

//@Post('logout') CHANGE TO POST FOR FRONT END USE LATER ON
//TODO: handle disconnect
@UseGuards(AuthenticatedGuard)
@Get('logout')
async logOut(@Req() request,@Res() res ) {
//request.user.isConnected = false;
await this.userRepo.update( { id:request.user.id }, {isConnected:false, isVerified:false});
//request.user.isVerified = false;
request.logOut();
request.session.cookie.maxAge = 0;

//return res.redirect('http://localhost:3000/auth/login');
}
}