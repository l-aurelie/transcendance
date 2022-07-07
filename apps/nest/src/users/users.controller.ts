/*aurelie, samantha, Laura*/

import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body, UseInterceptors, UploadedFile, Res, StreamableFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from 'src/auth/guards';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { User } from 'src/typeorm/entities/User';
import { Avatar } from 'src/typeorm/entities/Avatar';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { RoomEntity, RoomUser } from 'src/typeorm';

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
   @InjectRepository(RoomUser) private readonly  roomUser : Repository<RoomUser>) {}   /* Retourne le profil de l'utilisateur courant */
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

   @Get('testing/test')
   async getUsersInChannel(
      @Req() request,
      ) {
         console.log('IN USERSINCHANNEL');
         const users = await this.roomUser.find({
            relations: ["user", "room"],
         });
         console.log('HERE!!!!!!!!!!!!!!!!!!!!!!!!!*********************** ===> ' + (users));
         console.log(users[0].user.login);
         console.log(users[0].user.avatar);
         console.log(users[0].room.creatorId);
         console.log(users[0].room.password);
   }

   //-* UPLOAD l'image et la place dans la base de donnee
   //@UseGuards(AuthenticatedGuard)
   @Post('setimg/:userId')
   @UseInterceptors(FileInterceptor('file'/*, {dest: './upload'}*/))
   async setImg(@UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser,@Param('userId') userId: number) {
   //au lieu d'utiliser id: 1 il faut utiliser req.user.id mais useGuard ne fonctionne pas 
      console.log('===setImg()')
      console.log('file', file);
      const ActualUser = await this.userRepo.findOne({id : 1});
      const buf64 = (file.buffer).toString('base64');
      let newUrl;
      if (file.mimetype === 'image/jpeg')
         newUrl = "data:image/jpeg;base64,"+buf64;
      else if (file.mimetype === 'image/png')
         newUrl = "data:image/png;base64,"+buf64;
      await this.userRepo.update({id:userId}, {avatar:newUrl});
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

  @Post('changemdp/:currentSalonId/:newmdp')
   async changeMdp(
   @Param('newmdp') new_password: string, 
   @Param('currentSalonId') salonId: string) {
      const currentSal = parseInt(salonId);
      const room_user = await this.roomUser.findOne(
         { relations: ["room"],
            where : {roomId: currentSal}
         });
      console.log(room_user);
      room_user.room.password = new_password;
      console.log(room_user);
      const ret = await this.roomRepo.update( {id:room_user.room.id}, {password: new_password});
   }

  @Post('/setAdminTrue/:currentSalonId')
   async setAminTrue(@Param('currentSalonId') salonId: string) {
      const currentSal = parseInt(salonId);
      const room_user = await this.roomUser.findOne(
         {
            where : {roomId: currentSal}
         });
      console.log(room_user);
      room_user.isAdmin = true;
      const ret = await this.roomUser.save(room_user);
   }

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


   /* Retourne tous les utilisateurs presents dans la base de donnee */
   @Get('all')
   async getUsers() {
      const users = await this.userServ.findAll();
      //console.log('GetUsers()');
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