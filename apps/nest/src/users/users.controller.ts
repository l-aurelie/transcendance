/*aurelie, samantha*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { FriendRequest } from 'src/typeorm/entities/friend-request';
import { User } from 'src/typeorm/entities/User';

/* localhost:3000/users */
@Controller('users')
export class UsersController {
   constructor(private userServ : UsersService) {}
   /* Retourne le profil de l'utilisateur courant */
   @UseGuards(AuthenticatedGuard)
   @Get()
   getUser(@Headers() header, @Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
     console.log('===getUser', user);
     return (user);
     }
     
   /* Retourne tous les utilisateurs presents dans la base de donnee */
   @Get('all')
   async getUsers() {
      const users = await this.userServ.findAll();
      console.log('GetUsers()');
      return (users);
   }
   
   /* Retourne le user [login] */
   @Get(':login')
   async getUserByLogin(@Param() params) {
      const user = await this.userServ.findUserByLogin(params);
      console.log('=====getUserByLogin()', user);
      return (user);
   }

   /* Retourne le user [id] */
   @Get(':id')
   async getUserByID(@Param() userStringId: string): Promise<User> {
      const userId = parseInt(userStringId);
      const user = await this.userServ.findUserById(userId);
      return (user);
   }

     /* send friend request */
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/send/:receiverId')
     async sendFriendRequest(
        @Param('receiverId') receiverStringId: string,
        @Req() request,
     ): Promise<FriendRequest | { error: string }> {
      const receiverId = parseInt(receiverStringId);
      const requestSent = this.userServ.sendFriendRequest(receiverId, request.user);
      return requestSent ;
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
    /* constroller pour post sur path user */
    @Post()
    addUser() {
       console.log('log : user successfully add');
       return 'user successfully add';
    }

    /* constroller pour delete sur path user */
    @Delete()
    deleteUser() {
       console.log('log : user successfully delete');
       return 'user successfully delete';
    }
}