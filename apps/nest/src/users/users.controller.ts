/*aurelie, samantha, Laura*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body, UseInterceptors, UploadedFile, Res, StreamableFile, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard, IntraAuthGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { User } from 'src/typeorm/entities/User';
//import { Avatar } from 'src/typeorm/entities/Avatar';
import { Not, Repository, UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { RoomEntity, RoomUser, UserBlock } from 'src/typeorm';
import { RoomService } from 'src/chat/service/room.service';
import * as bcrypt from 'bcrypt';

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
//     console.log('===getUser', user);
return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email});
//  return (user);
     }

  /* @UseGuards(AuthenticatedGuard)
   @Get('set')
   setUser(@Req() request: RequestWithUser) {//TODO: async ? 
      const user = request.user;
  //     console.log('===getUser', user);
       return (user);
   }*/

   /* WIP: set le profil avec le formulaire envoye */
   @UseGuards(AuthenticatedGuard)
   //@UseGuards(IntraAuthGuard)
   @Post('set')
   async setUsers(@Req() req: RequestWithUser, @Body() body: setProfilDto) {
      console.log('SetUser===()');
      console.log('BODY1', body);
      const already = await this.userRepo.findOne({where:{login: req.body.login}});
      if (already)
      {
         if (already.id !== req.body.id)
            return false;
      }
     // console.log('req.user', req.user);
      await this.userRepo.update({ id: req.body.id }, {login: req.body.login, email: req.body.email, twoFA: req.body.twoFA});
      return (true);
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
  // @UseGuards(AuthenticatedGuard)
   @UseGuards(AuthenticatedGuard)
   @Post('setimg/:userId')
   @UseInterceptors(FileInterceptor('file'/*, {dest: './upload'}*/))
   async setImg(@UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser,@Param('userId') userId: number) {
   //au lieu d'utiliser id: 1 il faut utiliser req.user.id mais useGuard ne fonctionne pas 
   //   console.log('===setImg()')
    //  console.log('file', file);
      //const ActualUser = await this.userRepo.findOne({id : 1});
      console.log('passe in img');
      if (!file || !file.buffer)
         return;
      const buf64 = (file.buffer).toString('base64');
      let newUrl;
      if (file.mimetype === 'image/jpeg')
         newUrl = "data:image/jpeg;base64,"+buf64;
      else if (file.mimetype === 'image/png')
         newUrl = "data:image/png;base64,"+buf64;
      await this.userRepo.update({id:userId}, {avatar:newUrl});
      const data = '{"status":"200"}';
      return(JSON.parse(data));
    /*  const ActualUser = await this.userRepo.findOne({id : 1})
      //-* Enregistre l'avatar en format bytea dans Avatar2 une relation one avec le user
      if(!ActualUser.Avatar2)
      {
         console.log("if--");
         const avatar = this.avatarRepo.create();
         avatar.name = file.fieldname;
         avatar.data = file.buffer;
         avatar.mimeType = file.mimetype;
         //avatar.user = ActualUser;
         await this.avatarRepo.save(avatar);
         //let avatar : Avatar  = { id: null, name: file.fieldname, data : file.buffer, mimeType : file.mimetype , user: ActualUser};
         //this.avatarRepo.save(avatar); 
         this.userRepo.update({id: 1}, {Avatar2: avatar})   
      }
      else
      {
         console.log('else--');//Condition a faire
         const avatar = this.avatarRepo.create();
         avatar.name = file.fieldname;
         avatar.data = file.buffer;
         avatar.mimeType = file.mimetype;
         //avatar.user = ActualUser;
         await this.avatarRepo.save(avatar);
         this.userRepo.update({id: 1}, {Avatar2: avatar})   
      }
      */
      //const thisUser = await this.userRepo.find({ relations: ["Avatar2"]});
      //console.log("this USER ====== ", thisUser);
      
      //const thisUser = this.avatarRepo.findOne({where: {user.id: 1}});
      //const thisUser = await this.avatarRepo.find({ relations: ["user"], where: [ {user.id: 1}],});
      //const thisUser = await this.avatarRepo.find({ relations: ["user"]});
      //console.log("this USER ====== ", thisUser);

      //await this.userRepo.update({ id: 1}, {avatar: './upload/' + file.filename});
      //await this.userRepo.update({ id: 1}, {avatar: './upload/' + file.filename});
      //console.log('req.user', req.user);
    //  return ('SetImg()');
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
   @Post('/setAdminFalse/:currentSalonId')
   async setAminFalse(@Param('currentSalonId') salonId: string) {
      const currentSal = parseInt(salonId);
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal}
         });
      console.log(room_user);
      room_user.isAdmin = false;
      const ret = await this.roomUser.save(room_user);
   }

   @UseGuards(AuthenticatedGuard)
   @Post('/mute')
   async mute(@Body() body: setUserRoomDto)
   {
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
   @Post('/ban')
   async ban(@Body() body: setUserRoomDto)
   {
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

   /* Retourne tous les utilisateurs presents dans la base de donnee */
   @Get('all')
   async getUsers() {
      const users = await this.userServ.findAll();
      //console.log('GetUsers()');
      let tab = [];
      for (let entry of users)
      {
     // return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA});
      tab.push({id:entry.id, avatar:entry.avatar, login:entry.login, color:entry.color, twoFA:entry.twoFA, isVerified:entry.isVerified, email:entry.email})
      }
      //return (users);
   return(tab);
   }
   @Get('allNoMembers/:roomId')
   async getNoMember(@Param('roomId') roomId : string) {
      const users = await this.userServ.findAll();
      //console.log('GetUsers()');
      let tab = [];
      const id = parseInt(roomId);
      for (let entry of users)
      {
         let isMember = await this.roomUser.find({where: {roomId:id, userId:entry.id}});
         if(isMember.length === 0)
            tab.push({id:entry.id, avatar:entry.avatar, login:entry.login, color:entry.color, twoFA:entry.twoFA, isVerified:entry.isVerified, email:entry.email})
      // return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA});
      }
      //return (users);
   return(tab);
   }

   /* Retourne le user [login] */
   @Get(':login')
   async getUserByLogin(@Param() params) {
      const user = await this.userServ.findUserByLogin(params);
      //console.log('=====getUserByLogin()', user);
      //return (user);
      return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email});
   }

   /* Retourne le user [id] */
   @Get(':id')
   async getUserByID(@Param() userStringId: string) {
      const userId = parseInt(userStringId);
      const user = await this.userServ.findUserById(userId);
      //return (user);
      return ({id:user.id, avatar:user.avatar, login:user.login, color:user.color, twoFA:user.twoFA, isVerified:user.isVerified, email:user.email});

   }
   @Get('userRooms/:id')
   async getUserRooms(@Param('id') id : string) {
      const idUser = parseInt(id);
   const rooms = await this.roomUserRepo.createQueryBuilder().where({ userId: idUser }).execute();
   let tab = [];
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
            tab.push({
               salonName: roomName,
               dm: false,
               displayName: roomName,
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
         tab.push({
         salonName: roomName,
         dm: false,
         displayName: roomName,
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
      // @Req() request,
      ) : Promise<RoomUser[]> {
         console.log('IN USERSINCHANNEL');
         if (currentSalon === "undefined")
         {
           // console.log('undef');
            return([]);
         }
         const room = this.roomRepo.findOne({where: {id:currentSalon}});
      
         const users = await this.roomUser.find({
            relations: ["user", "room"],
            where : {roomId: currentSalon, userId:Not((await room).creatorId),}});
         //   console.log('HERE!!!!!!!!!!!!!!!!!!!!!!!!!*********************** ===> ' + (users));
         //   console.log(users[0].user.login);
         //   console.log(users[0].user.avatar);
         //   console.log(users[0].room.creatorId);
         //   console.log(users[0].room.password);
         //   console.log('quoi');
         return (users);
   }

   //set a userBlock instance
   @Get('setBlock/:idBlocking/:idBlocked')
   async setBlock(@Param('idBlocking') idBlocking : string, @Param('idBlocked') idBlocked:string)
   {
      const userBlocking = parseInt(idBlocking);
      const userBlocked = parseInt(idBlocked);
      const already = await this.blockRepo.find({where: {blockingUserId:userBlocking , blockedUserId:userBlocked}})
      if (already.length > 0)
         return ;
      const create = await this.blockRepo.create({blockingUserId:userBlocking, blockedUserId:userBlocked});
      this.blockRepo.save(create);
   }

   @Get('isBlock/:idBlocking/:idBlocked')
   async isBlock(@Param('idBlocking') idBlocking : string, @Param('idBlocked') idBlocked:string)
   {
      const userBlocking = parseInt(idBlocking);
      const userBlocked = parseInt(idBlocked);
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
      const already = await this.blockRepo.find({where: {blockingUserId:userBlocking , blockedUserId:userBlocked}})
      if (already.length === 0)
         return ;
      const create = await this.blockRepo.delete({id:already[0].id});
   }

   //return all room that a user joined when he logged
   @Get('members/:idRoom')
   async members(@Param('idRoom') idRoom: string) {
      const id = parseInt(idRoom);
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


   //  @Get('testing/test')
   // async getUsersInChannel(
   //    @Req() request,
   //    ) {
   //       console.log('IN USERSINCHANNEL');
   //       const users = await this.roomUser.find({
   //          relations: ["user", "room"],
   //       });
   //       console.log('HERE!!!!!!!!!!!!!!!!!!!!!!!!!*********************** ===> ' + (users));
   //       console.log(users[0].user.login);
   //       console.log(users[0].user.avatar);
   //       console.log(users[0].room.creatorId);
   //       console.log(users[0].room.password);
   // }


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