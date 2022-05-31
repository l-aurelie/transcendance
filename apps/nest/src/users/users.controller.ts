/*aurelie, samantha*/

import { Controller, Get, Post, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController { //controller pour localhist:3000/users
   constructor(private userServ : UsersService) {}
    @Get()
    getUser(@Headers() header) { //fonction test TODO: pk header?
      // console.log(header);
      const user = this.userServ.findUserById(1).then((result) => { // trouve dans la db l'utilisateur ayant pour identifiant '1'
         return result; // retourne le login de l'utilisateur avec id '1'
      })
    return user; //return login de l'utilisateur ayant l' id '1'
    }

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