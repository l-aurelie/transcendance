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
import { Socket, User } from 'src/typeorm';
import { UsersService, SocketService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RoomService } from './service/room.service';

// this decorator will allow us to make use of the socket.io functionnalitu
@WebSocketGateway({ cors: '*:*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // We set up a variable 'server' with the decorator which will give us access to the server instance
    // we then can use this to trigger events and send data to connected clients
    @WebSocketServer() server;
    users: number = 0;

    constructor(private userService: UsersService, @InjectRepository(User) private userRepo : Repository<User>, private socketService: SocketService, @InjectRepository(Socket) private socketRepo : Repository<Socket>) {}


    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection(client) {
        // A client has connected
        this.users++;
        console.log(this.users);
        // Notify connected clients of current users
        
        this.server.emit('users', this.users);
        client.emit()
    }

    async handleDisconnect(client) {
        // A client has disconnected
        this.users--;
        //const user = await this.userService.findUserBySocket(client.id);
        //this.userRepo.remove({socket : client.id});
        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    // this decorator is used to listenning incomming messages. chat channel
    @SubscribeMessage('chat')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.p1 channel would receivethis data instantly
        console.log('sendMessage');
        const socket = await this.socketRepo.find({ relations: ["user"],
        where: {
            name : client.id
        } });
        //const socket = await socks.find(client.id);
        console.log('here===', socket);
        const ok = new Date(Date.now()).toLocaleString();
       // this.server.emit(data.p1, '[' + socket.user.login + '] ' +  '[' + ok + '] ' + data.p2);
    }
 
    @SubscribeMessage('whoAmI')
    async linkUserSocket(client, user) {
      //const leUser =  this.userService.findUserById(user.id);
      console.log('setToDb');
      console.log(client.id);
      //console.log(user);
      const sock = this.socketRepo.create();
      sock.name = client.id;
      sock.user = user;
     
      await this.socketRepo.save(sock);
      console.log('here', sock.user);
      //console.log(user.socket); 
     //this.userRepo.update({id : user.id},{socket : client.id});
    }

    @SubscribeMessage('addsalon')
    // event d'ajout de salon
    async addsalon(client, salon_to_add) {
        const newRoom = {name: salon_to_add, users: client};
        console.log(client.id);
        //const actualUser = this.userRepo.findUserById(this.users);
        //this.create
        //tous les users ecoutant le channel newsalon (donc tt le monde) recoivent l'ajout de salon
       // console.log(salon_to_add);
       // console.log(this.users);
        this.server.emit('newsalon', salon_to_add);
    }
}

