/*samanth aurelie*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";

@Injectable()
export class UsersService {
    constructor (@InjectRepository(User) private userRepo: Repository<User>) {}
  
    findUserById(idnum: number){ //getter pour trouver user par id
        return this.userRepo.findOne( {id: idnum} );
    };
    /*findUserById(idnum: number){ //getter pour trouver user par id
        return this.userRepo.findOne( {id: idnum} );
    };*/

   /* Retourne l'utilisateur [login] */
    findUserByLogin(login: string): Promise<User> {
        return this.userRepo.findOne(login);//TODO: findOne or fail
        //return this.userRepo.findOne( { login: string } );
    };   
    /* Retourne tous les utilisateurs present dans la table users */
    findAll(): Promise<User[]> {
        return this.userRepo.find( { } );
    };
}