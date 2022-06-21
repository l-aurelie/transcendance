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


/*********************/
/****FRIEND REQUESTS */
/*********************/
//TODO: friend service 

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

    async hasSentMe(
        User: User, 
        Me: User
        ): Promise<FriendRequest | { error: string }> {
           
            const check = await this.friendRequestRepository.findOne({
                where: [
                { sender: User, receiver: Me },
            ],
            });
            if (!check)
            {
                //console.log("FALSE NOT FOUND ANYTHING!!!!");
                return { error: "Not found"};
            }
            //console.log("TRUEEE");
            //console.log("Check is: ", check);
            return check;
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
    
    const friendReq = await this.getFriendRequestUserById(FriendRequestId);
    
    friendReq.status = newStatus;
    
    const ret = await this.friendRequestRepository.save(friendReq);
    
    return ret.status;
}

async testAcceptFriendRequest(FriendRequestId: number, newStatus: FriendRequestStatus) : Promise<FriendRequestStatus> {
    const friendReq = await this.getFriendRequestUserById(FriendRequestId);
    friendReq.status = newStatus;
    const ret = await this.friendRequestRepository.save(friendReq);
    return ret.status;
}

async getReceivedFriendRequests(currentUser: User) : Promise<any> {
    

    const temp = await this.friendRequestRepository.find({
        relations: ["sender"],
        where: [ {receiver: currentUser, status: "pending"}],
    });
        return temp;
}

async getAllLogins() : Promise<string[]>{
        let userz = await this.userRepo.find(
            {
                select: ["login"],
            }
        );
        let ret : string[] = userz.map( userz => userz.login );
        //console.log("IN GETALLLOGINS, ret is:", ret);
        return ret;
    }

async getSentFriendRequests(currentUser: User) : Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({sender: currentUser });
}

async getFriendList(currentUser: User) : Promise<User[]> { 
    //console.log("getting friend list");
    //QUERY ONE: get all rows from friend_request where status == accepted and sender is currentUser 
    //autrement dit: get all friend requests sent by current user and accepted by receiver
    let group_one = await this.friendRequestRepository.find( 
        { relations: ["sender", "receiver"],
        where: [
            { sender: currentUser, status: "accepted" },
        ],
    }
    );
     //QUERY TWO: get all rows from friend_request where status == accepted and receiver is currentUser
     //Autrement dit: get all friend requests accepted by the current user
    let group_two = await this.friendRequestRepository.find( 
        { relations: 
            ["sender", "receiver"],
        where: [
            { receiver: currentUser, status: "accepted" },
        ],
    }
    );
    //get the users who accepted this user's friend requests OR get the users who sent requests to this user which have been accepted, i.e. FRIENDS!
    
    let friends1 : User[] = group_one.map( group_one => group_one.receiver);
    let friends2 : User[] = group_two.map( group_two => group_two.sender);
    //console.log(friends);
   return friends1.concat(friends2);
}

}

@Injectable()
export class SocketService {
    constructor (@InjectRepository(Socket) private socketRepo: Repository<Socket>) {}
  
    findSocketById(id_socket: string){ //getter pour trouver user par id
        return this.socketRepo.findOne( {name: id_socket} );
    };
}