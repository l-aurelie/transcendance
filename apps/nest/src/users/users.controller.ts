/*aurelie, samantha*/

import { Controller, Get, Post, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController { //controller pour localhist:3000/users
   constructor(private userServ : UsersService) {}
    @Get()
    getUser(@Headers() header) { //fonction test
      // console.log(header);
      const user = this.userServ.findUserById(1); // trouve dans la db l'utilisateur ayant pour identifiant '1'
      const log = user.then(function(result){ //fonction qui permet de parser le resultat et de le lire
       //  console.log(result);
         return result.login; // retourne le login de l'utilisateur avec id '1'
      })
    return log; //return login de l'utilisateur ayant l' id '1'
    }

    @Post()
    addUser() {
       console.log('log : user successfully add');
       return 'user successfully add';
    }

    @Delete()
    deleteUser() {
       console.log('log : user successfully delete');
       return 'user successfully delete';
    }
}