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
import { Socket, User, RoomEntity, Message, Games } from 'src/typeorm';
import { UsersService, SocketService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RoomService } from './service/room.service';
import { MessageService } from './service/message.service';

export var gameQueue = [];

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
        @InjectRepository(Message) private messageRepo: Repository<Message>,
        @InjectRepository(Games) private gameRepo: Repository<Games>,
        private messageService: MessageService,
        private roomService: RoomService,
        private userService: UsersService,
     //    private gameQueue: any[]
        ) {}


    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection(client) {
        // A client has connected
        this.users++;
     //   console.log(this.users);
        // Notify connected clients of current users
        console.log('ICI');
        this.server.emit('users', this.users);
        client.emit()
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

    @SubscribeMessage('join')
    async joinRoom(client, name) {
      client.join(name);
    }

    @SubscribeMessage('leave')
    async leaveRoom(client, name) {
      client.leave(name);
    }

    // this decorator is used to listenning incomming messages. chat channel
    @SubscribeMessage('chat')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.p1 channel would receivethis data instantly
        console.log('sendMessage');
        const socket = await this.socketRepo.findOne({ relations: ["user"],
        where: {
            name : client.id
        } });
        //const socket = await socks.find(client.id);
        console.log('here===', socket);
        const time = new Date(Date.now()).toLocaleString();
        console.log(data.p1);
        await this.messageService.addMessage(data.p2, data.p1, socket.user.id);
        this.server.to(data.p1).emit('chat', '[' + socket.user.login + '] ' +  '[' + time + '] ' + data.p2);
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
      //console.log(user.socket); 
     //this.userRepo.update({id : user.id},{socket : client.id});
    }

    @SubscribeMessage('addsalon')
    // event d'ajout de salon
    async addsalon(client, infos) {
        const newRoom = await this.roomService.createRoom(infos[0], infos[1], infos[2]);
        this.roomService.associateUserRoom(newRoom, infos[0], infos[1]);
        this.server.emit('newsalon', infos[2]);
    }


    //--------------------------------------------------------------------------------------------//
    //----------------------------------GAME------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//
    
    async matchMake()
    {
        console.log("match Make");
        console.log("gameQueue length", gameQueue.length);
        let roomName;
        if(gameQueue.length %2 == 0)//TODO 
        {
            console.log(gameQueue[0].user)
            const details = {
               playerLeft: gameQueue[0].user,
               playerRight: gameQueue[1].user,
            }
            const newGame = await this.gameRepo.save(details);
            roomName = newGame.id;
            this.joinRoom(gameQueue[0].sock, roomName);
            this.joinRoom(gameQueue[1].sock, roomName);
            this.server.to(roomName).emit("game-start",  roomName);  
            gameQueue.splice(0,2);
        }
    }


    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, userId) {
        this.server.to(socket.id).emit("received");
        const tab = { sock: socket, user: userId };        
        if(!gameQueue.find(element =>  socket.id === element.sock.id))
            gameQueue.push(tab);
        this.matchMake();
    }

   
    @SubscribeMessage('moveDown')
    async  paddleDown(client, infos) { //infos[0] => userId, infos[1] -> roomGameId infos[2] ->posHR infos[3] ->posHL
       console.log('in move down');
        const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (idGame.playerLeft === infos[0] )
        {
            const pos = idGame.posLeft;
            let newPos = pos + 20;
            if(newPos >= 300)
                newPos = 300;
            this.gameRepo.update({id : infos[1]}, {posLeft : newPos});
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (idGame.playerRight === infos[0])
        {
            const pos = idGame.posRight;
            let newPos = pos + 20;
            if(newPos >= 300)
                newPos = 300;
            this.gameRepo.update({id : infos[1]}, {posRight : newPos});
            this.server.to(infos[1]).emit("right-move", newPos);
        }
    }

    @SubscribeMessage('moveUp')
    async  paddleUp(client, infos) { //infos[0] == userId, infos[1] == roomGameId 
       console.log('in move up');
        const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (idGame.playerLeft === infos[0] )
        {
            const pos = idGame.posLeft;
            let newPos = pos - 20;
            if(newPos <= 0)
                newPos = 0;
            this.gameRepo.update({id : infos[1]}, {posLeft : newPos});
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (idGame.playerRight === infos[0])
        {
            const pos = idGame.posRight;
            let newPos = pos - 20;
            if(newPos <= 0)
                newPos = 0;
            this.gameRepo.update({id : infos[1]}, {posRight : newPos});
            this.server.to(infos[1]).emit("right-move", newPos);
        }
    }

    @SubscribeMessage('ball')
    async  updateBallX(server, infos) { //infos[0] == roomName 
        
        let width = 480;
        let height = 320;
        var ballRadius = 10;
    
        const idGame = await this.gameRepo.findOne({id:infos[0]});
        var dx = idGame.deltaX;
        var dy = idGame.deltaY;
        var by = idGame.posBallY;
        var bx = idGame.posBallX;
        if (idGame)
        {

            //dans la condition si dessous si la balle touche les bords droits
            //et gauches on devra verifier si ca touche le paddle
            // 1. si ca touche le paddle on change rien 
            //2. si ca touche le mur score pour l'adversaire
          
            if((idGame.posBallX + idGame.deltaX > width - ballRadius) || (idGame.posBallX + idGame.deltaX < ballRadius)) {
                dx = -idGame.deltaX;
            }
            if((idGame.posBallY + idGame.deltaY > height - ballRadius) || (idGame.posBallY + idGame.deltaY < ballRadius)) {
               dy = -idGame.deltaY;
            }
            
            bx = idGame.posBallX + idGame.deltaX;
            by = idGame.posBallY + idGame.deltaY;

         //     console.log('infos = ' + ball.x + "  " + ball.y);

            this.gameRepo.update( {id : infos[0]}, {posBallX:bx, posBallY:by, deltaX: dx, deltaY:dy});
            const ball = {x : bx, y: by}
            this.server.to(infos[0]).emit("updatedBall", ball);
        }
         
    } 
}

