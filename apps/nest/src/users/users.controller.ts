/*aurelie, samantha*/

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
   getUser(@Headers() header, @Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
    // console.log('===getUser', user);
     return (user);
     }

   /* WIP: set le profil avec le formulaire envoye */
   @Put('set')
   async setUsers(@Req() req: any, @Body() body: setProfilDto) {
      console.log('REQ1', req);
      console.log('BODY1', body);
      // console.log("req in set: ", req, data);
      //const users = await this.userServ.findAll();
      //await this.userRepo.update({ login: req.params.login }, { email: Req.params.login });
      console.log('SetUsers()');
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

/*--------------------------------------------------------------------------------------*/
/*----------------------------------------FRIEND----------------------------------------*/
/*--------------------------------------------------------------------------------------*/
//TODO: friend controller

     /* send friend request to receiverId*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/send/:receiverId')
     async sendFriendRequest(
        @Param('receiverId') receiverStringId: string,
        @Req() request,
     ): Promise<FriendRequest | { error: string }> {
      const receiverId = parseInt(receiverStringId);
      console.log("SENDING FRIENDE REQUEST TO ", receiverId);
      const requestSent = this.userServ.sendFriendRequest(receiverId, request.user);
      return requestSent ;
     }

      /*returns all your friends*/
      @UseGuards(AuthenticatedGuard)
      @Get('friendRequest/me/friendlist')
      async getFriendList(
         @Req() request,
      ) : Promise<User[]> {
      console.log("IN CORRECT FUNCTION");
      return await this.userServ.getFriendList(request.user);
      }

   /*check status of friend request that we have sent to receiverID*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/status/:receiverId')
     async getFriendRequestStatus(
        @Param('receiverId') receiverStringId: string,
        @Req() request,
     ): Promise<FriendRequestStatus> {
      const receiverId = parseInt(receiverStringId);
      const status = this.userServ.getFriendRequestStatus(receiverId, request.user);
      return status ;
     }

      /*respond to friend request with newStatus (accepted/declined/pending) */
      @UseGuards(AuthenticatedGuard)
      @Put('friendRequest/respond/:friendRequestId')
      async respondToFriendRequest(
         @Param('friendRequestId') friendRequestStringId: string,
         @Body() newStatus: FriendRequestStatus,
      ): Promise<FriendRequestStatus> {
       const friendRequestId = parseInt(friendRequestStringId);
       return this.userServ.respondToFriendRequest(friendRequestId, newStatus);
      }

       /*easy way to change friend request to accept for tests */
       @UseGuards(AuthenticatedGuard)
       @Get('friendRequest/testAccept/:friendRequestId')
       async testAcceptFriendRequest(
          @Param('friendRequestId') friendRequestStringId: string,
       ): Promise<FriendRequestStatus> {
        const friendRequestId = parseInt(friendRequestStringId);
        return this.userServ.testAcceptFriendRequest(friendRequestId,"accepted");
       }

      /*returns all your received friend requests*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/me/received-requests')
     async getReceivedFriendRequests(
        @Req() request,
     ): Promise<FriendRequest[]> {
      return this.userServ.getReceivedFriendRequests(request.user);
     }

     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/me/hasSentMe/:UserId')
     async hasSentMe(
      @Param('user') the_user : User,
      @Req() request,
      ): Promise<boolean> {
      return this.userServ.hasSentMe(the_user, request.user);
   }

     @Get('data/getAllLogins')
     async getLogins() : Promise<string[]>
     {
        return this.userServ.getAllLogins();
     }

      /*returns all your sent friend requests*/
      @UseGuards(AuthenticatedGuard)
      @Get('friendRequest/me/sent-requests')
      async getSentFriendRequests(
         @Req() request,
      ): Promise<FriendRequest[]> {
       return this.userServ.getSentFriendRequests(request.user);
      }

}