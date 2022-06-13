/*samanth aurelie*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";
import { Socket } from "src/typeorm";
import { FriendRequest } from "src/typeorm/entities/friend-request";
import { FriendRequestStatus } from "src/typeorm/entities/friend-request-interface";

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(FriendRequest)
        private readonly friendRequestRepository: Repository<FriendRequest>) {}
  
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


/*********************/
/****FRIEND REQUESTS */
/*********************/

async hasRequestBeenSentOrReceived(
    sender: User, 
    receiver: User
    ): Promise<boolean> {
       
        const check = await this.friendRequestRepository.findOne({
            where: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender },
        ],
        });
        if (!check)
            return false;
        return true;
    }

async sendFriendRequest(receiverId: number, sender: User): Promise<FriendRequest | { error: string }> {
    if (receiverId == sender.id)
        return {error: "You cant add yourself as a friend, loser"};
    const receiver = await this.findUserById(receiverId);
    if (await this.hasRequestBeenSentOrReceived(sender, receiver) == true )
        return {error: "You have already sent a request, chill"};
    let MyFriendRequest: FriendRequest = {
        //how to set id?
        id: null, sender, receiver, status: 'pending'
    }
    return this.friendRequestRepository.save(MyFriendRequest);
}

async getFriendRequestStatus(receiverId: number, sender: User): Promise<FriendRequestStatus> {
    const receiver = await this.findUserById(receiverId);
    const MyReq = await this.friendRequestRepository.findOne({
        where: [
        { sender: sender, receiver: receiver },
    ],
    });
    return MyReq.status;
}

async getFriendRequestUserById(FriendRequestId: number) : Promise<FriendRequest>{
    return this.friendRequestRepository.findOne( {id: FriendRequestId} );
}

async respondToFriendRequest(FriendRequestId: number, newStatus: FriendRequestStatus) : Promise<FriendRequestStatus> {
    const friendReq = this.getFriendRequestUserById(FriendRequestId);
    const ret = await this.friendRequestRepository.save({
        ...friendReq,
        status: newStatus,
    });
    return ret.status;
}

async getReceivedFriendRequests(currentUser: User) : Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({receiver: currentUser });
}

async getSentFriendRequests(currentUser: User) : Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({sender: currentUser });
}

}

@Injectable()
export class SocketService {
    constructor (@InjectRepository(Socket) private socketRepo: Repository<Socket>) {}
  
    findSocketById(id_socket: string){ //getter pour trouver user par id
        return this.socketRepo.findOne( {name: id_socket} );
    };
}