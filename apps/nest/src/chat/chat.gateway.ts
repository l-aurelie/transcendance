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
import { Socket, User, RoomEntity, Message, Games, RoomUser } from 'src/typeorm';
import { UsersService, SocketService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RoomService } from './service/room.service';
import { MessageService } from './service/message.service';
import { resolve } from 'path';

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
        @InjectRepository(RoomUser) private roomUserRepo: Repository<RoomUser>,
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
        const whichuser = await this.socketRepo.findOne({where: {name:client.id}});
console.log(whichuser);
     //   console.log(this.users);
        // Notify connected clients of current users
        console.log('ICI');
        this.server.emit('users', this.users);
    }

    async handleDisconnect(client) {

        // A client has disconnected
        this.users--;
        console.log(client.id);
        const whichuser = await this.socketRepo.findOne({where: {name:client.id}});
        if(whichuser)
        {
            const isUser = await this.socketRepo.find({where: {idUser: whichuser.idUser}});
            if (isUser.length === 1)
            {
               const room = await this.gameRepo.find({where: [{playerLeft:whichuser.idUser, finish:false}, {playerRight:whichuser.idUser, finish: false},]});
                for (let entry of room)
                    this.server.to(entry.id).emit("opponent-leave");
            }
        }
       // console.log(whichuser.idUser);
       // var stock = whichuser.idUser;
     /*  if (whichuser)
       {
        const isUser = await this.socketRepo.find({where: {idUser: whichuser.idUser}});
        if (isUser.length === 1)
        {
            const deco = await this.userRepo.findOne({where: {id: whichuser.idUser}});
            deco.isConnected = false;
            deco.isVerified = false; 
            console.log("jjj", deco.isConnected)
        }
    }*/
      //  console.log(whichuser, whichuser.idUser);
      //  const idStock = whichuser.idUser;
        //const user = await this.userService.findUserBySocket(client.id);
        //this.userRepo.remove({socket : client.id});
        // Notify connected clients of current users
        await this.socketRepo.createQueryBuilder().delete().where({ name: client.id }).execute();
      //  const isUser = await this.socketRepo.findOne({where: {userId: idStock}});
       // if (!isUser)
        //    {
        //        const deco = await this.userRepo.findOne({where: {id: idStock}});
        //        deco.isConnected = false;
        //        deco.isVerified = false; 
        //    }
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
      sock.idUser = user.id;
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
    
    @SubscribeMessage('initGame')
    async initGame( client, user)
    {
        console.log('receive init GAAAME');
        for (let entry of gameQueue)
      {
          console.log ('iin gameQueue entry.user=', entry.user, ' userid=', user)

        if (entry.user === user)
        {
          this.server.to(client.id).emit("already-ask");
          break;
        }
        return ;
    }
      const allGame = await this.gameRepo.find( { } );

      for (let entry of allGame) {
          if ((entry.playerLeft === user || entry.playerRight === user) && entry.finish === false)
          {
            console.log ("entre in allGame", entry.finish);
            this.joinRoom(client, entry.id);
            const data = {roomname:entry.id, sL:entry.scoreLeft, sR:entry.scoreRight};
            this.server.to(entry.id).emit("game-start", data);
            return;
          }
      }
    }

    async matchMake()
    {
        console.log("match Make");
        console.log("gameQueue length", gameQueue.length);
        let roomName;
        if(gameQueue.length % 2 === 0)//TODO 
        {       const details = {
                    playerLeft: gameQueue[0].user,
                    playerRight: gameQueue[1].user,
                }
                const newGame = await this.gameRepo.save(details);
                roomName = newGame.id;
                this.joinRoom(gameQueue[0].sock, roomName);
                this.joinRoom(gameQueue[1].sock, roomName);
             //   this.joinRoom(gameQueue[1].sock, roomName);
             const data = {roomname: roomName, sL: 0, sR:0}

                this.server.to(roomName).emit("game-start",  data);  
                const allSocketPlayer = await this.socketRepo.find({where:[{idUser: gameQueue[0].user}, {idUser: gameQueue[1].user}]});
                for (let entry of allSocketPlayer)
                {
                    if (entry.name != gameQueue[0].sock.id && entry.name != gameQueue[1].sock.id)
                        this.server.to(entry.name).emit("joinroom",  roomName);
                }
                gameQueue.splice(0,2);
        }
    }


    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, userId) {
        this.server.to(socket.id).emit("received");
        const tab = { sock: socket, user: userId };        
        if(!gameQueue.find(element =>  userId === element.user))
        {
            const allSocketPlayer = await this.socketRepo.find({where:{idUser: userId}});
            for (let entry of allSocketPlayer)
                    this.server.to(entry.name).emit("joinroom");
            gameQueue.push(tab);
        }
        this.matchMake();
    }

   
    @SubscribeMessage('moveDown')
    async  paddleDown(client, infos) { //infos[0]=userId, infos[1]=roomGameId, infos[2]=allPos
        const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (idGame.playerLeft === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos + 10;
            // console.log("newPos", newPos);
            // console.log("height", infos[2].height);
            // console.log("[posHL", infos[2].posHL);
            // console.log("paddleSize", infos[2].paddleSize);
            if(newPos + infos[2].paddleSize >= infos[2].height)
                newPos = infos[2].height - infos[2].paddleSize;
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (idGame.playerRight === infos[0])
        {
            const pos = infos[2].posHR;
            let newPos = pos + 10;
            if(newPos + infos[2].paddleSize >= infos[2].height)
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
      //  var roster = server.clients(infos[0]);
       // for (let i in roster)
         //   console.log('client = ', roster[i]);
        //  console.log(infos[1].playerLeft, infos[1].playerRight);
        // const player1 = await this.userRepo.findOne({id:infos[1].playerLeft});
        // const player2 = await this.userRepo.findOne({id:infos[1].playerRight});
        // if (player1.isConnected === false || player2.isConnected === false)
        //     this.server.to(infos[0]).emit("opponent-leave");

        let width = infos[1].width; 
        let height = infos[1].height; 
        var ballRadius = infos[1].ballRadius;
        var dx = infos[1].deltaX;
        var dy = infos[1].deltaY;
        var by = infos[1].ballY;
        var bx = infos[1].ballX;
        var sL = infos[1].scoreL;
        var sR = infos[1].scoreR;
        var posL = infos[1].posHL;
        var posR = infos[1].posHR;
        var paddleW = infos[1].paddleLarge;
        var paddleH = infos[1].paddleSize;


        /* si la balle est sur les bord haut et bas du board */
        if((by + dy > height ) || (by + dy < 0)) {
            dy = -dy;
        } 
        
        /* si la balle touhce les bords du paddle */
        if ((bx < paddleW && posL <= by && posL + paddleH >= by) 
            || (bx > width - paddleW && posR <= by  &&  posR + paddleH >= by)) {
                dy = -dy;
        }
        /* si la balle touhce la longueur du paddle */
        else if ((bx === paddleW && posL <= by && posL + paddleH >= by) 
            || ((bx === width - paddleW && posR <= by && posR + paddleH >= by))) {
                dx = -dx;
        }
        bx = bx + dx;
        by = by + dy;

        if(bx > width ) {
            sL += 1;
            bx = width/2;
            by = height/2;   
        }
        if (bx < 0) {
            sR += 1;
            bx = width/2;
            by = height/2;
        }

        const ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy}
        this.server.to(infos[0]).emit("updatedBall", ball);
        if (sL >= 11 && sR < sL - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});

            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerLeft, looser:idGame.playerRight, finish:true, scoreLeft:sL, scoreRight:sR});

            const user = await this.userRepo.findOne({id: idGame.playerLeft});
            this.server.to(infos[0]).emit("game-stop", user.login);
        }
        if (sR >= 11 && sL < sR - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});

            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerRight, looser: idGame.playerLeft, finish:true, scoreLeft:sL, scoreRight:sR});

            const user = await this.userRepo.findOne({id: idGame.playerRight});
            this.server.to(infos[0]).emit("game-stop", user.login);
        }
    }
    @SubscribeMessage('updateScore')
    async updateScore(client, infos)
    {
       // console.log(infos[1], infos[2]);
        this.gameRepo.update( {id : infos[0]}, {scoreLeft:infos[1], scoreRight:infos[2]});

    }
}

