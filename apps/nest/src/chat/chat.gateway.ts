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
    async  paddleDown(client, infos) { //infos[0]=userId, infos[1]=roomGameId, infos[2]=allPos
        const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (idGame.playerLeft === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos + 10;
            console.log("newPos", newPos);
            console.log("height", infos[2].height);
            console.log("[posHL", infos[2].posHL);
            console.log("paddleSize", infos[2].paddleSize);
            if(newPos + infos[2].paddleSize >= infos[2].height - infos[2].paddleSize)
                newPos = infos[2].height - infos[2].paddleSize;
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (idGame.playerRight === infos[0])
        {
            const pos = infos[2].posHR;
            let newPos = pos + 10;
            if(newPos + infos[2].paddleSize >= infos[2].height - infos[2].paddleSize)
                newPos = infos[2].height - infos[2].paddleSize;
            this.server.to(infos[1]).emit("right-move", newPos);
        }
    }

    @SubscribeMessage('moveUp')
    async  paddleUp(client, infos) { //infos[0] == userId, infos[1] == roomGameId , infos[2] == allPos
        const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (idGame.playerLeft === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos - 10;
            if(newPos <= 0)
                newPos = 0;
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (idGame.playerRight === infos[0])
        {
            const pos = infos[2].posHR;
            let newPos = pos - 10;
            if(newPos <= 0)
                newPos = 0;
            this.server.to(infos[1]).emit("right-move", newPos);
        }
    }

    @SubscribeMessage('ball')
    async  updateBallX(server, infos) { //infos[0] == roomName , infos[1] = allPos
        
        let width = infos[1].width; 
        let height = infos[1].height; 
        var ballRadius = infos[1].ballRadius;
        var dx = infos[1].deltaX;
        var dy = infos[1].deltaY;
        var by = infos[1].ballY;
        var bx = infos[1].ballX;
        var sL = infos[1].scoreL;
        var sR = infos[1].scoreR;

        if (infos[1].ballY + infos[1].deltaY > infos[1].posHL
            && infos[1].ballY + infos[1].deltaY < infos[1].posHL + infos[1].paddleSize
            && infos[1].ballX + infos[1].deltaX <= infos[1].paddleLarge) {
                console.log('inLEFT dx', dx, ' dy',dy, ' bx', bx,' by',by, ' posHL', infos[1].posHL, ' poshr', infos[1].posHR, ' width', width, ' height', height,  ' paddlesize', infos[1].paddleSize, ' padleLarge', infos[1].paddleLarge);
                if (infos[1].ballX > infos[1].paddleLarge)
                    dx = -dx;
            }
        else if (infos[1].ballY + infos[1].deltaY > infos[1].posHR
            && infos[1].ballY + infos[1].deltaY < infos[1].posHR + infos[1].paddleSize
            && infos[1].ballX + infos[1].deltaX >= width - infos[1].paddleLarge) {
                console.log('inRIGHT dx', dx, ' dy',dy, ' bx', bx,' by',by, ' posHL', infos[1].posHL, ' poshr', infos[1].posHR, ' width', width, ' height', height,  ' paddlesize', infos[1].paddleSize, ' padleLarge', infos[1].paddleLarge);

                if (infos[1].ballX <width - infos[1].paddleLarge)
                    dx = -dx;
            }
        if((infos[1].ballY + infos[1].deltaY > height - ballRadius)
            || (infos[1].ballY + infos[1].deltaY < ballRadius)) {
            dy = -dy;
        }  
        bx = bx + dx;
        by = by + dy;
        if(infos[1].ballX + infos[1].deltaX > width - ballRadius) {
            sL += 1;
            bx = infos[1].width/2;
            by = infos[1].height/2;   
        }
        if (bx + dx < ballRadius) {
            sR += 1;
            bx = infos[1].width/2;
            by = infos[1].height/2;
        }

        const ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy}
        this.server.to(infos[0]).emit("updatedBall", ball);
        if (sL >= 11 && sR < sL - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerLeft, scoreLeft:sL, scoreRight:sR});
            const user = await this.userRepo.findOne({id: idGame.playerLeft});
            this.server.to(infos[0]).emit("game-stop", user.login);
        }
        if (sR >= 11 && sL < sR - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerRight, scoreLeft:sL, scoreRight:sR});
            const user = await this.userRepo.findOne({id: idGame.playerRight});
            this.server.to(infos[0]).emit("game-stop", user.login);
        }
    } 
}

