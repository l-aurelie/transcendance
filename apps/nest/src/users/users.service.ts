/*samanth, aurelie, Laura*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";
import { Socket } from "src/typeorm";
import { FriendRequest } from "src/typeorm/entities/friend-request";
import { Games } from "src/typeorm/entities/Games";
import { FriendRequestStatus } from "src/typeorm/entities/friend-request-interface";

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Games)
        private readonly gamesRepository: Repository<Games>,
        @InjectRepository(FriendRequest)
        private readonly friendRequestRepository: Repository<FriendRequest>) {}
  
    async findUserById(idnum: number){ //getter pour trouver user par id
        return await this.userRepo.findOne( {id: idnum} );
    };
    /*findUserById(idnum: number){ //getter pour trouver user par id
        return this.userRepo.findOne( {id: idnum} );
    };*/

   /* Retourne l'utilisateur [login] */
    findUserByLogin(login: string): Promise<User> {
        //console.log("USER SEARCHING", login);
        return this.userRepo.findOne(login);//TODO: findOne or fail
        //return this.userRepo.findOne( {login} );
    };   
    /* Retourne tous les utilisateurs present dans la table users */
    findAll(): Promise<User[]> {
        return this.userRepo.find( { } );
    };

}

@Injectable()
export class SocketService {
    constructor (@InjectRepository(Socket) private socketRepo: Repository<Socket>) {}
    findSocketById(id_socket: string){ //getter pour trouver user par id
        return this.socketRepo.findOne( {name: id_socket} );
    };
}