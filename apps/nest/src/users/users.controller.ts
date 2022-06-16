/*aurelie, samantha*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { FriendRequest } from 'src/typeorm/entities/friend-request';
import { User } from 'src/typeorm/entities/User';
import { FriendRequestStatus } from 'src/typeorm/entities/friend-request-interface';

/* localhost:3000/users */
@Controller('users')
export class UsersController {
   constructor(private userServ : UsersService) {}
   /* Retourne le profil de l'utilisateur courant */
   @UseGuards(AuthenticatedGuard)
   @Get()
   getUser(@Headers() header, @Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
    // console.log('===getUser', user);
     return (user);
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
     // console.log('=====getUserByLogin()', user);
      return (user);
   }

   /* Retourne le user [id] */
   @Get(':id')
   async getUserByID(@Param() userStringId: string): Promise<User> {
      const userId = parseInt(userStringId);
      const user = await this.userServ.findUserById(userId);
      return (user);
   }

     /* send friend request to receiverId*/
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

     @Get('getAllLogins')
     async getLogins()
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