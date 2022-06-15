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
import { Socket, User, RoomEntity } from 'src/typeorm';
import { UsersService, SocketService } from 'src/users/users.service';
import { Repository } from 'typeorm';
// import { RoomService } from './service/room.service';

// this decorator will allow us to make use of the socket.io functionnalitu
@WebSocketGateway({ cors: 'http://localhost:4200' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // We set up a variable 'server' with the decorator which will give us access to the server instance
    // we then can use this to trigger events and send data to connected clients
    @WebSocketServer() socket;
    users: number = 0;

    constructor(
        @InjectRepository(User) private userRepo : Repository<User>,
        private socketService: SocketService,
        @InjectRepository(Socket) private socketRepo : Repository<Socket>,
        @InjectRepository(RoomEntity) private roomRepo: Repository<RoomEntity>,
        //  private roomService: RoomService,
         private userService: UsersService
        ) {}


    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection(client) {
        // A client has connected
        this.users++;
        console.log(this.users);
        // Notify connected clients of current users
        
        this.socket.emit('users', this.users);
        client.emit()
    }

    async handleDisconnect(client) {
        // A client has disconnected
        this.users--;
        //const user = await this.userService.findUserBySocket(client.id);
        //this.userRepo.remove({socket : client.id});
        // Notify connected clients of current users
        await this.socketRepo.createQueryBuilder().delete().where({ name: client.id }).execute();
        this.socket.emit('users', this.users);
    }

    // this decorator is used to listenning incomming messages. chat channel
    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, roomCode: string) {
        //any clients listenning  for the chat event on the data.p1 channel would receivethis data instantly
        console.log('in create game');
       //create a room id
       let roomName = 2; // faudra fair eune fonction makeID
      this.socket.emit('roomCode', roomName);
      this.socket.join(roomName);
      //this.socket.emit('initilaisation', 1);

    }
 
}