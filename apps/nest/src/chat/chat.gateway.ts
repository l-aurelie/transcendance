/* https://www.joshmorony.com/creating-a-simple-live-chat-server-with-nestjs-websockets/ */

import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
    WebSocketGateway,
    WebSocketServer, 
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { IntraAuthGuard } from 'src/auth/guards';
import { Socket, User, RoomEntity, Message, RoomUser } from 'src/typeorm';
import { UsersService, SocketService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RoomService } from './service/room.service';
import { MessageService } from './service/message.service';
import { resolve } from 'path';

// this decorator will allow us to make use of the socket.io functionnalitu
@WebSocketGateway({ cors: 'http://localhost:4200' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // We set up a variable 'server' with the decorator which will give us access to the server instance
    // we then can use this to trigger events and send data to connected clients
    @WebSocketServer() server;
    users: number = 0;

    constructor(
        @InjectRepository(User) private userRepo : Repository<User>,
        private socketService: SocketService,
        @InjectRepository(Socket) private socketRepo : Repository<Socket>,
        @InjectRepository(RoomEntity) private roomRepo: Repository<RoomEntity>,
        @InjectRepository(RoomUser) private roomUserRepo: Repository<RoomUser>,
        @InjectRepository(Message) private messageRepo: Repository<Message>,
         private messageService: MessageService,
         private roomService: RoomService,
         private userService: UsersService
        ) {}


    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection(client) {
        // A client has connected
        this.users++;
     //   console.log(this.users);
        // Notify connected clients of current users
        console.log('ICI');
        this.server.emit('users', this.users);
    }

    async handleDisconnect(client) {
        // A client has disconnected
        this.users--;
        //const user = await this.userService.findUserBySocket(client.id);
        //this.userRepo.remove({socket : client.id});
        // Notify connected clients of current users
        await this.socketRepo.createQueryBuilder().delete().where({ name: client.id }).execute();
        this.server.emit('users', this.users);
    }

    //--------------------------------------------------------------------------------------------//
    //----------------------------------CHAT------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//

    /* Recupere tous les salon public existants dans la db */
    @SubscribeMessage('fetchsalon')
    async fetch_salon(client) {
        const salons = await this.roomRepo.find({where: { private : false }});
        client.emit('fetchsalon', salons);
     }

     /* Recupere tous les messages de la table RoomId [room] et les formatte pour l'affichage, les emit au front */
     @SubscribeMessage('fetchmessage')
     async fetch_message(client, room) {
        const message = await this.messageRepo.find({where: { roomID : await this.roomService.getRoomIdFromRoomName(room) }});
        let tab = [];
        /* Concatene userName et le contenu du message */
        tab = await Promise.all(message.map( async (it) : Promise<string[]> => {
                var user = await this.userService.findUserById(it.senderId);//TODO: peut etre revoir la structure DB car une requete db pour chaque message!
                return [...tab, user.login + ' : ' + it.content];
             }));
        client.emit('fetchmessage', tab);
      }

    /* Un user join la room, on cree une entre userRoom */
     @SubscribeMessage('user_joins_room')
     async user_joins_room(client, infos) {
       const userRoom = {userId: infos.userId, roomId: infos.room.id};
       this.roomUserRepo.save(userRoom);
       client.join(infos.room.name);
       /* On emit le nom du salon ajoute pour afficher dans les salon suivi sur le front */
       client.emit('joinedsalon', infos.room.name);
     }

    /* Recoit un message et unr room dans laquelle re-emit le message */
    @SubscribeMessage('chat')
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.roomToEmit channel would receive the message data instantly
        console.log('sendMessage', data.whoAmI);
        //const socket = await socks.find(client.id);
        const time = new Date(Date.now()).toLocaleString();
        await this.messageService.addMessage(data.message, data.roomToEmit, data.whoAmI.id); 
        this.server.to(data.roomToEmit).emit('chat', {emittingRoom: data.roomToEmit, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message});
    }
 
    //TODO: tjrs pertinent? 
    @SubscribeMessage('whoAmI')
    async linkUserSocket(client, user) {
      //const leUser =  this.userService.findUserById(user.id);
      console.log('setToDb');
      //console.log(user);
      const sock = this.socketRepo.create();
      sock.name = client.id;
      sock.user = user;
      await this.socketRepo.save(sock);
      //console.log(user.socket); 
     //this.userRepo.update({id : user.id},{socket : client.id});
    }

    @SubscribeMessage('addsalon')
    // event d'ajout de salon
    async addsalon(client, infos) {


        console.log(infos[0]);
       // const creatorRoom = await this.userService.findUserById(infos[0]);
   //     const getSoc = await this.socketRepo.findOne({name: client.id});
   //     console.log("hey here is addsalon!2");
   //     console.log(client.id, getSoc);
   //     const creatorRoom = await getSoc.user;
   //     console.log("hey here is addsalon!3");
    //    const newRoom = {name : infos[2], creatorId: infos[0]};
   //     console.log("hey here is addsalon!4");
        const newRoom = await this.roomService.createRoom(infos[0], infos[1], infos[2]);
        this.roomService.associateUserRoom(newRoom, infos[0], infos[1]);
   //     console.log("hey here is addsalon!5");
        this.server.emit('newsalon', infos[2]);
    }


    //--------------------------------------------------------------------------------------------//
    //----------------------------------GAME------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//

    matchMake(gameQueue: any)
    {
        if(gameQueue.lenght == 2)
        {
            
        }
    }

    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, roomCode: string) {
        let gameQueue = [];
        gameQueue.push(socket.id);
        //matchMake(gameQueue);
        //any clients listenning  for the chat event on the data.p1 channel would receivethis data instantly
        console.log('in create game');
       //create a room id
       let roomName = 2; // faudra fair eune fonction makeID
      //this.server.emit('roomCode', roomName);
      //this.server.join(roomName);
      
        //this.server.emit('initilaisation', 1);

    }
}

