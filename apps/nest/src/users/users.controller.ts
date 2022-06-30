/*aurelie, samantha, Laura*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { FriendRequest } from 'src/typeorm/entities/friend-request';
import { User } from 'src/typeorm/entities/User';
import { FriendRequestStatus } from 'src/typeorm/entities/friend-request-interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class setProfilDto {
   login: string;
   email:string;
   twoFA: boolean;
}

/* localhost:3000/users */
@Controller('users')
export class UsersController {
   constructor(private userServ : UsersService, @InjectRepository(User) private userRepo:Repository<User>) {}
   /* Retourne le profil de l'utilisateur courant */
   @UseGuards(AuthenticatedGuard)
   @Get()
   getUser(@Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
//     console.log('===getUser', user);
     return (user);
     }

  /* @UseGuards(AuthenticatedGuard)
   @Get('set')
   setUser(@Req() request: RequestWithUser) {//TODO: async ? 
      const user = request.user;
  //     console.log('===getUser', user);
       return (user);
   }*/

   /* WIP: set le profil avec le formulaire envoye */
   //@UseGuards(AuthenticatedGuard)
   @Post('set')
   async setUsers(@Req() req: RequestWithUser, @Body() body: setProfilDto) {
      console.log('SetUser===()');
      console.log('BODY1', body);
     // console.log('req.user', req.user);
      await this.userRepo.update({ id: req.body.id }, {login: req.body.login, email: req.body.email, twoFA: req.body.twoFA});
      return ('SetUsers()');
   }

   /* Retourne tous les utilisateurs presents dans la base de donnee */
   @Get('all')
   async getUsers() {
      const users = await this.userServ.findAll();
    //  console.log('GetUsers()');
      return (users);
   }

   /* Retourne le user [login] */
   @Get(':login')
   async getUserByLogin(@Param() params) {
      const user = await this.userServ.findUserByLogin(params);
      //console.log('=====getUserByLogin()', user);
      return (user);
   }

   /* Retourne le user [id] */
   @Get(':id')
   async getUserByID(@Param() userStringId: string): Promise<User> {
      const userId = parseInt(userStringId);
      const user = await this.userServ.findUserById(userId);
      return (user);
   }

/*
    @Get()
    getUser(@Headers() header) {
      // console.log(header);
      const user = this.userServ.findUserById(1).then((result) => { // trouve dans la db l'utilisateur ayant pour identifiant '1'
         return result; // retourne le login de l'utilisateur avec id '1'
      })
    return user; //return login de l'utilisateur ayant l' id '1'
    }
*/

}