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
import { User } from 'src/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RoomService } from './service/room.service';

// this decorator will allow us to make use of the socket.io functionnalitu
@WebSocketGateway({ cors: '*:*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // We set up a variable 'server' with the decorator which will give us access to the server instance
    // we then can use this to trigger events and send data to connected clients
    @WebSocketServer() server;
    users: number = 0;

    constructor(private userService: UsersService, @InjectRepository(User) private userRepo : Repository<User>) {}

    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection(client) {
        // A client has connected
        this.users++;
        console.log(this.users);
        // Notify connected clients of current users
        
        this.server.emit('users', this.users);
        client.emit()
    }

    async handleDisconnect() {
        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    // this decorator is used to listenning incomming messages. chat channel
    @SubscribeMessage('chat')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.p1 channel would receivethis data instantly
        console.log('sendMessage');
        this.server.emit(data.p1, data.p2);
    }
 
    @SubscribeMessage('whoAmI')
    async linkUserSocket(client, user) {
      //const leUser =  this.userService.findUserById(user.id);
      console.log('setToDb');
        this.userRepo.update({id : user.id},{socket : client.id});
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

