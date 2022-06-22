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
   getUser(@Headers() header, @Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
    // console.log('===getUser', user);
     return (user);
     }

   /* WIP: set le profil avec le formulaire envoye */
   @Put('set')
   async setUsers(@Req() req: any, @Body() body: setProfilDto) {
      console.log('BODY1', body);
     // await this.userRepo.update({ login: req.body.login }, { email: req.body.email });
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

/*--------------------------------------------------------------------------------------*/
/*----------------------------------------FRIEND [Laura]--------------------------------*/
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
      const requestSent = this.userServ.sendFriendRequest(receiverId, request.user);
      return requestSent ;
     }

      /*returns all your friends*/
      @UseGuards(AuthenticatedGuard)
      @Get('friendRequest/me/friendlist')
      async getFriendList(
         @Req() request,
      ) : Promise<User[]> {
      return await this.userServ.getFriendList(request.user);
      }

     /*check status of friend request that we have sent to receiverID*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/testing/:SenderId')
     async testing(
        @Param('SenderId') SenderStringId: string,
        @Req() request,
     ): Promise<FriendRequest | { error: string; }> {
      const SenderId = parseInt(SenderStringId);
      const sender = await this.userServ.findUserById(SenderId);
      return this.userServ.sendFriendRequest(request.user.id, sender);
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
      @Get('friendRequest/accept/:friendRequestId')
      async acceptFriendRequest(
         @Param('friendRequestId') friendRequestStringId: string,
      ): Promise<FriendRequestStatus> {
       const friendRequestId = parseInt(friendRequestStringId);
       return this.userServ.respondToFriendRequest(friendRequestId, "accepted");
      }

      /*rejects friend request indicated*/
      @UseGuards(AuthenticatedGuard)
      @Get('friendRequest/reject/:friendRequestId')
      async rejectFriendRequest(
         @Param('friendRequestId') friendRequestStringId: string,
      ): Promise<FriendRequestStatus> {
       const friendRequestId = parseInt(friendRequestStringId);
       return this.userServ.respondToFriendRequest(friendRequestId, "rejected");
      }

      /*returns all your PENDING received friend requests*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/me/received-requests')
     async getReceivedFriendRequests(
        @Req() request,
     ): Promise<FriendRequest[]> {
      return this.userServ.getReceivedFriendRequests(request.user);
     }

     /*Checks if user has already sent a friend request to you. If yes, returns the request. If not, returns an error message*/
     @UseGuards(AuthenticatedGuard)
     @Get('friendRequest/me/hasSentMe/:Userlogin')
     async hasSentMe(
      @Param('Userlogin') user_login : string,
      @Req() request,
      ): Promise<FriendRequest | { error: string }> {
      /*get user from login*/
      const the_user = await this.userRepo.findOne({where: [{ login: user_login}],
      });
      return this.userServ.hasSentMe(the_user, request.user);
   }

      /*returns all user.logins in database*/
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

      /*Game stats*/
      @UseGuards(AuthenticatedGuard)
      @Get('stats/getWins')
     async getWins(
      @Req() request,
     ) : Promise<number>
     {
        return this.userServ.getWins(request.user);
     }

     @UseGuards(AuthenticatedGuard)
      @Get('stats/getLosses')
     async getLosses(
      @Req() request,
     ) : Promise<number>
     {
        return this.userServ.getLosses(request.user);
     }

}