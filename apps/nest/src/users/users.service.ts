/*samanth aurelie*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";

@Injectable()
export class UsersService {
    constructor (@InjectRepository(User) private userRepo: Repository<User>) {}
   // findUserById(idnum: number){ //getter pour trouver user par id
   //     return this.userRepo.findOne( where : { id: idnum, }, );
   // };
        
    /* Retourne tous les utilisateurs present dans la table users */
    findAll(){
        return this.userRepo.find( { } );
    };
}