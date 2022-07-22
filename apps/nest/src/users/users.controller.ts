/*aurelie, samantha, Laura*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body, UseInterceptors, UploadedFile, Res, StreamableFile, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard, IntraAuthGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { User } from 'src/typeorm/entities/User';
import { Not, Repository, UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { RoomEntity, RoomUser, UserBlock } from 'src/typeorm';
import { RoomService } from 'src/chat/service/room.service';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';

const fs = require('fs');
const resizeImg = require('resize-image-buffer');

export class setUserRoomDto {
   userId: string;
   roomId:string;
   pwd: string;
}
export class setProfilDto {
   login: string;
   email:string;
   twoFA: boolean;
}

export class setNewCreatorDto {
  newCreator: string;
  roomId : string;
}

export class setImgDto {
   login: string;
   email:string;
   twoFA: boolean;
}

/* localhost:3000/users */
@Controller('users')
export class UsersController {
   constructor(private userServ : UsersService, @InjectRepository(User) private userRepo:Repository<User>, 
   @InjectRepository(RoomEntity) private roomRepo: Repository<RoomEntity>,
   @InjectRepository(RoomUser) private roomUserRepo: Repository<RoomUser>,
   @InjectRepository(RoomUser) private readonly  roomUser : Repository<RoomUser>,
   @InjectRepository(UserBlock) private readonly  blockRepo : Repository<UserBlock>,
   private roomService: RoomService) {}   /* Retourne le profil de l'utilisateur courant */
   @UseGuards(AuthenticatedGuard)
   @Get()
   getUser(@Req() request: RequestWithUser) {//TODO: async ? 
     const user = request.user;
   return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email, first: user.first});
     }
   
   @UseGuards(AuthenticatedGuard)
   @Get('getMyId')
   getMyId(@Req() request: RequestWithUser) : number {//TODO: async ?
    return (request.user.id);
   }

   /* WIP: set le profil avec le formulaire envoye */
   @UseGuards(AuthenticatedGuard)
   @Post('set')
   async setUsers(@Req() req: RequestWithUser, @Body() body: setProfilDto) {
      try {
         const user = await this.userRepo.findOne({where:{id:req.body.id}});
         const already = await this.userRepo.findOne({where:{login: req.body.login}}); 
         if (already)
         {
            if (already.id != req.body.id)
               return {bool:false, msg: "login already use by someone else!"};
         }
         const already2 = await this.userRepo.findOne({where:{email: req.body.email}});
         if (already2)
         {
            if (already2.id != req.body.id)
               return {bool:false, msg: "email already use by someone else!"};
         }
      user.login = req.body.login;
      const error = await validate(user);
      if (error.length > 0)
         return {bool:false, msg: "invalide login!"};
      user.email = req.body.email;
      const error2 = await validate(user);
      if (error2.length > 0)
         return {bool:false, msg: "invalide email!"};
      else
         await this.userRepo.update({ id: req.body.id }, {login: req.body.login, email: req.body.email, twoFA: req.body.twoFA});
   } catch(e) {
      return {bool:false, msg: "update impossible, check your informations"};
     }
     return ({bool:true, msg:""});
   }

   //-* A DECOMMENTER pour obtenir l'img
   //-* Renvoie l'image sous un format affichable
   /* @Get('getimg')
   async getImg(@Res({ passthrough: true }) res: any) {
      const imgRaw = await this.avatarRepo.findOne( {id: 1} );
      const stream = Readable.from(imgRaw.data);
      res.set({
        'Content-Disposition': `inline; filename="${imgRaw.name}"`,
        'Content-Type': 'image'
    })
    return new StreamableFile(stream);
   }*/

   //-* UPLOAD l'image et la place dans la base de donnee
   @UseGuards(AuthenticatedGuard)
   @Get('setimg/:userId')
   @UseInterceptors(FileInterceptor('file'/*, {dest: './upload'}*/))
   async setImg(@UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser,@Param('userId') userId: number) {
   //au lieu d'utiliser id: 1 il faut utiliser req.user.id mais useGuard ne fonctionne pas 
      console.log('file', file);
      try {
      console.log('passe in img');
      if (!file || !file.buffer)
         return;
      let buf64;
      let newUrl;
      console.log ('trop grand');
      const image = await resizeImg(file.buffer, {width:150, height:150});
      buf64 = (image).toString('base64');
      if (file.mimetype === 'image/jpeg')
         newUrl = "data:image/jpeg;base64,"+buf64;
      else if (file.mimetype === 'image/png')
         newUrl = "data:image/png;base64,"+buf64;
      await this.userRepo.update({id:userId}, {avatar:newUrl});
      const data = '{"status":"200", "message":"ok"}';
      return(JSON.parse(data));
      } catch(e) {
         const data = '{"status":"500", "message": "invalid photo or size"}';
         return(JSON.parse(data));
      }
   }

   @UseGuards(AuthenticatedGuard)
   @Post('changemdp')
   async changeMdp(@Body() body: setUserRoomDto) {
      const currentSal = parseInt(body.roomId);
      const room_user = await this.roomUser.findOne(
         { relations: ["room"],
            where : {roomId: currentSal}
         });
      const saltOrRounds = 10;
      const hash =  await bcrypt.hash(body.pwd, saltOrRounds);
      console.log("NEW PASSWORD" + body.pwd);
      console.log("HASH ===> " , hash);
      room_user.room.password = hash;
      const ret = await this.roomRepo.update( {id:room_user.room.id}, {password: hash});
      return({status:201})
      /* To compare/check a password, use the compare function:
      const isMatch = await bcrypt.compare(password, hash); */
   }

   @UseGuards(AuthenticatedGuard)
   @Post('resetpwd')
   async resetPwd(@Body() body: setUserRoomDto) {
     const currentSal = parseInt(body.roomId);
     const room_user = await this.roomUser.findOne(
        { relations: ["room"],
           where : {roomId: currentSal}
        });
     console.log(room_user);
     room_user.room.password = "";
     console.log(room_user);
     console.log("NEW PASSWORD :" + "[" + room_user.room.password +  ']');
     const ret = await this.roomRepo.update( {id:room_user.room.id}, {password: room_user.room.password});
     return({status:201})
   }

  @UseGuards(AuthenticatedGuard)
  @Post('/setAdminTrue')///:currentSalonId/:idNewAdm')
   async setAminTrue(@Body() body: setUserRoomDto)// ,@Param('currentSalonId') salonId: string,@Param('idNewAdm') idNewAdm: string) 
   {
      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
      const currentSal = parseInt(body.roomId);//salonId);
      const adm = parseInt(body.userId);//idNewAdm)
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal, userId: adm}
         });
      console.log('room user id' ,room_user.id);
      this.roomUser.update({id:room_user.id}, {isAdmin:true});
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/setAdminFalse')///:currentSalonId/:idNewAdm')
    async setAminFalse(@Body() body: setUserRoomDto)// ,@Param('currentSalonId') salonId: string,@Param('idNewAdm') idNewAdm: string) 
    {
      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
       const currentSal = parseInt(body.roomId);//salonId);
       const adm = parseInt(body.userId);//idNewAdm)
       const room_user = await this.roomUser.findOne(
          {
             where : {roomId: currentSal, userId: adm}
          });
       console.log('room user id' ,room_user.id);
       this.roomUser.update({id:room_user.id}, {isAdmin:false});
       return({status:201})
    }
  
   @UseGuards(AuthenticatedGuard)
   @Post('/mute')
   async mute(@Body() body: setUserRoomDto)
   {
      console.log(body.roomId, body.userId)

      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
      const currentSal = parseInt(body.roomId);
      const id = parseInt(body.userId);
      const dateT = new Date().getTime() + 120000;//86400000;
      const expired = new Date(dateT);
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal, userId: id}
         });
      this.roomUser.update({id: room_user.id}, {mute:true, expiredMute: expired});
      console.log("is mute = " + room_user.mute);
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/firstFalse')
   async forstFalse(@Body() body: setUserRoomDto)
   {
      if (parseInt(body.userId) === 0)
         return ({status:404});
      const id = parseInt(body.userId);
      this.userRepo.update({id: id}, {first:false});
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/unmute')
   async unmute(@Body() body: setUserRoomDto)
   {
      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
      const currentSal = parseInt(body.roomId);
      const id = parseInt(body.userId);
     
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal, userId: id}
         });
      this.roomUser.update({id: room_user.id}, {mute:false});
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/ban')
   async ban(@Body() body: setUserRoomDto)
   {
      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
      const currentSal = parseInt(body.roomId);
      const id = parseInt(body.userId);
      const dateT = new Date().getTime() + 120000//86400000;
      const expired = new Date(dateT);
      console.log('date.now', dateT, expired);
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal, userId: id}
         });
      this.roomUser.update({id:room_user.id}, {ban:true, expireBan: expired});
      console.log("is ban = " + room_user.ban);
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/unban')
   async unban(@Body() body: setUserRoomDto)
   {
      if (body.roomId === "undefined" || parseInt(body.userId) === 0)
         return ({status:404});
      const currentSal = parseInt(body.roomId);
      const id = parseInt(body.userId);
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal, userId: id}
         });
      this.roomUser.update({id:room_user.id}, {ban:false});
      return({status:201})
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/setNewCreator')
   async setNewCreator(@Body() body: setNewCreatorDto)
   {
      if (body.roomId === "undefined" || parseInt(body.newCreator) === -1)
         return ({status:404});
      const id = parseInt(body.newCreator);
      const idRoom = parseInt(body.roomId);
      await this.roomRepo.update({id:idRoom}, {creatorId:id});
      const relation = await this.roomUserRepo.find({where:{roomId:idRoom, userId:id}});
      await this.roomUserRepo.update({id: relation[0].id}, {isAdmin:true});
      return({status:201})
   }

   /* Retourne tous les utilisateurs presents dans la base de donnee */
   @Get('all')
   async getUsers() {
      const users = await this.userServ.findAll();
      let tab = [];
      for (let entry of users)
      {
         tab.push({id:entry.id, avatar:entry.avatar, login:entry.login, color:entry.color, twoFA:entry.twoFA, isVerified:entry.isVerified, email:entry.email})
      }
      return(tab);
   }

   @Get('allNoMembers/:roomId')
   async getNoMember(@Param('roomId') roomId : string) {
      const users = await this.userServ.findAll();
      let tab = [];
      const id = parseInt(roomId);
      if (!Number.isInteger(id))
      {
         console.log("function expected number");
         return null;
      }
      for (let entry of users)
      {
         let isMember = await this.roomUser.find({where: {roomId:id, userId:entry.id}});
         if(isMember.length === 0)
            tab.push({id:entry.id, avatar:entry.avatar, login:entry.login, color:entry.color, twoFA:entry.twoFA, isVerified:entry.isVerified, email:entry.email})
      }
      return(tab);
   }

   /* Retourne le user [login] */
   @Get(':login')
   async getUserByLogin(@Param('login') params : string) {
      const user = await this.userServ.findUserByLogin(params);
      if (!user)
         return null;
      return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email});
   }

   /* Retourne le user [id] */
   @Get(':id')
   async getUserByID(@Param() userStringId: string) {
      console.log("---------------getBYID");
      const userId = parseInt(userStringId);
      if (!Number.isInteger(userId))
      {
         console.log("expected integer");
         return null;
      }
      const user = await this.userServ.findUserById(userId);
      return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email});
   }

   @Get('userRooms/:id')
   async getUserRooms(@Param('id') id : string) {
   const idUser = parseInt(id);
   if (!Number.isInteger(idUser))
      return null;
   let tab = [];

   const dm = await this.roomRepo.find({where:{directMessage:true}});
   for (let room of dm)
   {
      const arr = (room.name).split('.');
      if (parseInt(arr[0]) === idUser)
      {
         const user2 = await this.userRepo.findOne({where:{id: parseInt(arr[1])}});
         let disp;
         if (user2.login.length > 10)
            disp = user2.login.substring(0,9) + "...";
         else
            disp = user2.login;
         tab.push({
            salonName : room.name,
            dm: true,
            displayName: disp,
            roomId :room.id,
            isAdmin: false,
            creator: false,
            private: false
         })
      }
      else if (parseInt(arr[1]) === idUser)
      {
         const user2 = await this.userRepo.findOne({where:{id: parseInt(arr[0])}});
         let disp;
         if (user2.login.length > 10)
            disp = user2.login.substring(0,9) + "...";
         else
            disp = user2.login;
         tab.push({
            salonName : room.name,
            dm: true,
            displayName: disp,
            roomId :room.id,
            isAdmin: false,
            creator: false,
            private: false
         })
      }
   }
   const rooms = await this.roomUserRepo.createQueryBuilder().where({ userId: idUser }).execute();
   for (let room of rooms) {
   var roomName = await this.roomService.getRoomNameFromId(room.RoomUser_roomId);
   var roomCreator = await this.roomService.getRoomCreatorFromId(room.RoomUser_roomId);
   var roomPrivate = await this.roomService.getRoomPrivateFromId(room.RoomUser_roomId);
   console.log('rooms5 = ', room.RoomUser_ban, room.RoomUser_mute, room.RoomUser_expiredMute, room.RoomUser_expireBan);
   if (room.RoomUser_ban === true) {
         const date = new Date().getTime();
         if (room.RoomUser_mute === true){
            if (date >= room.RoomUser_expiredMute.getTime())
               await this.roomUserRepo.update({id:room.RoomUser_id}, {mute:false});
         }
   if (date >= room.RoomUser_expireBan.getTime()) {
            await this.roomUserRepo.update({id:room.RoomUser_id}, {ban:false});
            let disp;
            if (roomName.length > 10)
               disp = roomName.substring(0,9) + "...";
            else
               disp = roomName;
            tab.push({
               salonName: roomName,
               dm: false,
               displayName: disp,
               roomId:room.RoomUser_roomId,
               isAdmin:room.RoomUser_isAdmin,
               creator:roomCreator, 
               private:roomPrivate,
            });
         }
      }
      else if (room.RoomUser_ban === false) {
         if (room.RoomUser_mute === true){
            const date = new Date().getTime();
            if (date >= room.RoomUser_expiredMute.getTime())
               await this.roomUserRepo.update({id:room.RoomUser_id}, {mute:false});
         }
         let disp;
         if (roomName.length > 10)
            disp = roomName.substring(0,9) + "...";
         else
            disp = roomName;
         tab.push({
         salonName: roomName,
         dm: false,
         displayName: disp,
         roomId:room.RoomUser_roomId,
         isAdmin:room.RoomUser_isAdmin,
         creator:roomCreator, 
         private:roomPrivate,
      });
      }
      }
   return (tab);
   }

   /* Retourne la liste des utilisateurs presents dans un salon */
   @Get('test/:currentSalon')
   async getUsersInChannel(
      @Param('currentSalon') currentSalon: string
      ) : Promise<RoomUser[]> {
         console.log('IN USERSINCHANNEL');
         if (currentSalon === "undefined")
            return([]);
         const currentSalonInt = parseInt(currentSalon);
         const room = this.roomRepo.findOne({where: {id: currentSalonInt}});
         if (!Number.isInteger(currentSalonInt))
            return ([]);
         const users = await this.roomUser.find({
            relations: ["user", "room"],
            where : {roomId: currentSalonInt, userId:Not((await room).creatorId),}});
         let tab = [];
         for (let entry of users)
         {
            const details = {userId: entry.user.id, userLogin: entry.user.login, isAdmin:entry.isAdmin};
            tab.push(details);
         }
         return (tab);
   }

   //set a userBlock instance
   @Get('setBlock/:idBlocking/:idBlocked')
   async setBlock(@Param('idBlocking') idBlocking : string, @Param('idBlocked') idBlocked:string)
   {
      const userBlocking = parseInt(idBlocking);
      const userBlocked = parseInt(idBlocked);
      if (!Number.isInteger(userBlocked) || !Number.isInteger(userBlocking))
         return null;
      const already = await this.blockRepo.find({where: {blockingUserId:userBlocking , blockedUserId:userBlocked}})
      if (already.length > 0)
         return ;
      const create = await this.blockRepo.create({blockingUserId:userBlocking, blockedUserId:userBlocked});
      await this.blockRepo.save(create);
   }

   @Get('isBlock/:idBlocking/:idBlocked')
   async isBlock(@Param('idBlocking') idBlocking : string, @Param('idBlocked') idBlocked:string)
   {
      const userBlocking = parseInt(idBlocking);
      const userBlocked = parseInt(idBlocked);
      if (!Number.isInteger(userBlocked) || !Number.isInteger(userBlocking))
         return null;
      const already = await this.blockRepo.find({where: {blockingUserId:userBlocking , blockedUserId:userBlocked}})
      if (already.length > 0)
         return true;
      else
         return false;
   }

   @Get('setUnblock/:idBlocking/:idBlocked')
   async setUnblock(@Param('idBlocking') idBlocking : string, @Param('idBlocked') idBlocked:string)
   {
      const userBlocking = parseInt(idBlocking);
      const userBlocked = parseInt(idBlocked);
      if (!Number.isInteger(userBlocked) || !Number.isInteger(userBlocking))
         return null;
      const already = await this.blockRepo.find({where: {blockingUserId:userBlocking , blockedUserId:userBlocked}})
      if (already.length === 0)
         return ;
      const create = await this.blockRepo.delete({id:already[0].id});
   }

   //return all room that a user joined when he logged
   @Get('members/:idRoom')
   async members(@Param('idRoom') idRoom: string) {
      const id = parseInt(idRoom);
      if (!Number.isInteger(id))
         return [];
      const allRelations = await this.roomUser.find({where: {roomId:id}});
      let tab = [];
      for (let entry of allRelations)
      {
         let log = await this.userRepo.findOne({where: {id:entry.userId}});
         let show = log.login;
         if (entry.mute === true)
            show += " (mute)";
         if (entry.ban === true)
            show += " (ban)";
         tab.push({value:log.id, label:show});
      }
      console.log('members in back', tab)
      return tab;
   }

   /* Retourne si il y a un password */
   @Get('pwd/:currentSalon')
   async getPwd(@Param('currentSalon') currentSalon: string) {
      console.log('IN USERSINCHANNEL 2');
      console.log('current SALON : ' + currentSalon);
      if (currentSalon === "undefined")
      {
         console.log('undef');
         return(false);
      }
      var currentSal = parseInt(currentSalon);
      if (!Number.isInteger(currentSal))
         return (false);
      console.log('current SAL: ' + currentSal);
      const room = await this.roomRepo.findOne({where: {id:currentSal}});
      console.log("ROOM +++> ", room);
      console.log("PWD +++> ", room.password);
      const pwd = room.password;
      console.log("password == ", pwd);
      if (pwd == null)
      {   
         console.log("RETURN 0");
         return(false);
      }
      else
      {   
         console.log("RETURN 1");
         return(true);
      }
   }
   
   /* check si le password est valide */
   @UseGuards(AuthenticatedGuard)
   @Post('/checkpwd')
   async checkpwd(@Body() body: setUserRoomDto) {
      console.log(body.pwd);
      if (!body.pwd)
         return(false);
      const currentSal = parseInt(body.roomId);
      const room = await this.roomRepo.findOne({where:{id:currentSal}});
      const pwdHashed = room.password;
      const isMatch = await bcrypt.compare(body.pwd, pwdHashed);
      console.log("MATCH === ", isMatch);
      return (isMatch);
   }

   @Get('whichBan/:currentSalon')
   async whichBan(@Param('currentSalon') currentSalon: string) {
      console.log('ban', currentSalon)
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, ban:true}});
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         if (user.id != room.creatorId)
            tab.push(user);
      }
      return tab;
   }
   
   @Get('whichMute/:currentSalon')
   async whichMute(@Param('currentSalon') currentSalon: string) {
      console.log('mute', currentSalon)
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, mute:true}});
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         if (user.id != room.creatorId)
            tab.push(user);
      }
      return tab;
   }

   @Get('whichAdm/:currentSalon')
   async whichAdm(@Param('currentSalon') currentSalon: string) {
      console.log('adm', currentSalon)
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, isAdmin:true}});
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         if (user.id != room.creatorId)
            tab.push(user);
      }
      return tab;
   }

   @Get('whichNonAdm/:currentSalon')
   async whichNonAdm(@Param('currentSalon') currentSalon: string) {
      console.log('nonadm', currentSalon)
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, isAdmin:false}});
      
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         console.log("nonAdm",user.login, user.id)
         if (user.id != room.creatorId)
            tab.push(user);
      }
      return tab;
   }

   @Get('whichNonMute/:currentSalon')
   async whichNonMute(@Param('currentSalon') currentSalon: string) {
      console.log('nonmute', currentSalon)
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, mute:false}});
      const admins = await this.roomUserRepo.find({where:{roomId:id, isAdmin:true}});
      const adminIdsArray = admins.map((it) => it.userId);
      console.log(adminIdsArray);
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         console.log("nonmute",user.login, user.id)
         console.log('hereers', user.id);
         if (user.id != room.creatorId && !adminIdsArray.includes(user.id))
            tab.push(user);
      }
      return tab;
   }

   @Get('getColor/:userId')
   async getColor(@Param('userId') userId:string) {
      let color = "rgba(0,0,0,1)";
      const userIdInt = parseInt(userId);
      if (!Number.isInteger(userIdInt))
         return ([]);
      const user = await this.userRepo.findOne({where:{id: userIdInt}});
      if (user)
         color = user.color;
      return (color);
   }

   @Get('whichNonBan/:currentSalon')
   async whichNonBan(@Param('currentSalon') currentSalon: string) {
      console.log('nonban', currentSalon)
      if (currentSalon === "undefined")
      {
         return([]);
      }
      const id = parseInt(currentSalon);
      if (!Number.isInteger(id))
         return ([]);
      const room = await this.roomRepo.findOne({where:{id:id}});
      const repo = await this.roomUserRepo.find({where:{roomId:id, ban:false}});
      const admins = await this.roomUserRepo.find({where:{roomId:id, isAdmin:true}});
      const adminIdsArray = admins.map((it) => it.userId);
      console.log(adminIdsArray);
      let tab = [];
      for (let entry of repo) {
         const user = await this.userRepo.findOne({where:{id:entry.userId}});
         console.log("nonban",user.login, user.id)
         if (user.id != room.creatorId && !adminIdsArray.includes(user.id))
            tab.push(user);
      }
      return tab;
   }
}