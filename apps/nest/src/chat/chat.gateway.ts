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
import  * as moment from 'moment';
import 'moment-timezone';

export var gameQueue = [];
export var gameQueueSmach = [];

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
     //   console.log(this.users);
        // Notify connected clients of current users
        //client.join('sockets' + whichuser.user.id);
        this.server.emit('users', this.users);
    }

    async handleDisconnect(client) {
        const the_date = moment().tz("Europe/Paris").format('dddd Do MMM YY, hh:mm');

        // A client has disconnected
        this.users--;
        this.disconnectGame(client, the_date);
        await this.socketRepo.createQueryBuilder().delete().where({ name: client.id }).execute();
        this.server.emit('users', this.users);
    }

    async disconnectGame(client, the_date)
    {
        const whichuser = await this.socketRepo.findOne({where: {name:client.id}});
        if(whichuser)
        {
            const isUser = await this.socketRepo.find({where: {idUser: whichuser.idUser}});
            if (isUser.length === 1)
            {
                var i = 0;
               for (let entry of gameQueue)
               {
                if (entry.user.id === whichuser.idUser) {
                    gameQueue.splice(i, i+1);
                    break;
                }
                i++;
               } 
               i = 0;
               for (let entry of gameQueueSmach)
               {
                if (entry.user.id === whichuser.idUser) {
                    gameQueueSmach.splice(i, i+1);
                    break;
                }
                i++;
               }
               const room = await this.gameRepo.find({where: [{playerLeft:whichuser.idUser, finish:false}, {playerRight:whichuser.idUser, finish: false},]});
        
               for (let entry of room)
                {
                    this.server.to(entry.id).emit("opponent-leave");
                    if (whichuser.idUser === entry.playerLeft)
                    {
                        const user2 = await this.socketRepo.find({where: {idUser: entry.playerRight}});
                        if (user2.length === 0)
                        {
                            let win = 0;
                            let loose = 0;
                            if (entry.scoreLeft > entry.scoreRight)
                               {
                                    win = entry.playerLeft;
                                    loose = entry.playerRight;
                                }
                               if (entry.scoreRight > entry.scoreLeft)
                                {
                                    win = entry.playerRight;
                                    loose = entry.playerLeft;
                                }
                            this.gameRepo.update( {id : entry.id}, {winner: win, looser:loose, date: the_date, finish: true});
                            this.server.to(entry.id).emit("restart");

                        }
                    }
                    else if (whichuser.idUser === entry.playerRight)
                    {
                        const user2 = await this.socketRepo.find({where: {idUser: entry.playerLeft}});
                        if (user2.length === 0)
                        {
                            let win = 0;
                            let loose = 0;
                            if (entry.scoreLeft > entry.scoreRight)
                               {
                                    win = entry.playerLeft;
                                    loose = entry.playerRight;
                                }
                               if (entry.scoreRight > entry.scoreLeft)
                                {
                                    win = entry.playerRight;
                                    loose = entry.playerLeft;
                                }
                        
                            this.gameRepo.update( {id : entry.id}, {winner: win, looser:loose, finish: true, date:the_date});

                            this.server.to(entry.id).emit("restart");
                        }
                    }
                   
                }
            }
        }
    }
    @SubscribeMessage('join')
    async joinRoom(client, name) {
      client.join(name);
    }

    @SubscribeMessage('leave')
    async leaveRoom(client, name) {
      client.leave(name);
    }
    @SubscribeMessage('disco')
    async disconnect(client) {
        console.log( 'disco');
        client.disconnect();
        console.log( 'disco');

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
         console.log( await this.roomService.getRoomIdFromRoomName(room), room)
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
       console.log(await this.roomService.getRoomIdFromRoomName(infos.room));
       const userRoom = {userId: infos.userId, roomId: await this.roomService.getRoomIdFromRoomName(infos.room)};
       this.roomUserRepo.save(userRoom);
       client.join('salonRoom' + infos.room);
       //this.server.in('sockets' + infos.userId).socketsJoin('salonRoom' + infos.room);
       var displayName = infos.room;
       if (infos.otherLogin) {
           displayName = infos.otherLogin;
       }
       /* On emit le nom du salon ajoute pour afficher dans les salon suivi sur le front */
       console.log(!(!infos.otherLogin));
       //this.server.to('sockets' + infos.userId).emit('joinedsalon', {salonName: infos.room, dm: !(!infos.otherLogin), displayName: displayName});
       client.emit('joinedsalon', {salonName: infos.room, dm: !(!infos.otherLogin), displayName: displayName});
     } 

    /* Un user quitte la room, on supprime une entre userRoom */
    @SubscribeMessage('user_leaves_room')
    async user_leaves_room(client, infos) {
        console.log(client.id, infos.room, infos.userId);
      await this.roomUserRepo.createQueryBuilder().delete().where({ userId: infos.userId, roomId: await this.roomService.getRoomIdFromRoomName(infos.room) }).execute();
      //this.server.in('sockets' + infos.userId).socketsLeave('salonRoom' + infos.room);
      client.leave('salonRoom' + infos.room);
      /* On emit le nom du salon ajoute pour afficher dans les salon suivi sur le front */
    }

    /* Recoit un message et unr room dans laquelle re-emit le message */
    @SubscribeMessage('chat')
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.roomToEmit channel would receive the message data instantly
        //const socket = await socks.find(client.id);
        const time = new Date(Date.now()).toLocaleString();
        await this.messageService.addMessage(data.message, data.roomToEmit, data.whoAmI.id); 
        if (data.isDm) {
            const otherUserId = data.roomToEmit.endsWith(data.whoAmI.id) ? data.roomToEmit.split('.')[0] : data.roomToEmit.split('.')[1];
            console.log(otherUserId); 
            console.log("all ohter user sockets", await this.server.in('sockets' + otherUserId).fetchSockets(), "roomname : " + 'sockets' + otherUserId);
            this.server.to('sockets' + otherUserId).emit('chat', {emittingRoom: data.roomToEmit, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, displayName: data.whoAmI.login});
            this.server.to('sockets' + data.whoAmI.id).emit('chat', {emittingRoom: data.roomToEmit, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, dontNotif: true});
        }
        else {
            console.log('notDMM');
            this.server.to('salonRoom' + data.roomToEmit).emit('chat', {emittingRoom: data.roomToEmit, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, displayName: data.roomToEmit});
        }
    }

    //TODO: tjrs pertinent? , displayName: data.whoAmI.login
    @SubscribeMessage('whoAmI')
    async linkUserSocket(client, user) {
      //const leUser =  this.userService.findUserById(user.id);

      //console.log(user);
      const sock = this.socketRepo.create();
      sock.name = client.id;
      sock.user = user;
      sock.idUser = user.id;
      await this.socketRepo.save(sock);
      console.log('sockets' + user.id, sock);
      client.join('sockets' + user.id);
      //console.log(user.socket); 
     //this.userRepo.update({id : user.id},{socket : client.id});
    }

    @SubscribeMessage('addsalon')
    // event d'ajout de salon
    async addsalon(client, infos) {
        console.log(infos)
        const newRoom = await this.roomService.createRoom(infos[0], infos[1], infos[2], infos[3]);
        this.roomService.associateUserRoom(newRoom, infos[0], infos[1]);
        if (!infos[1])
            this.server.emit('newsalon', infos[3]);
    }


    //--------------------------------------------------------------------------------------------//
    //----------------------------------GAME------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//
    
    @SubscribeMessage('initGame')
    async initGame( client, user)
    {
        for (let entry of gameQueue)
      {
        if (entry.user.id === user)
        {
            console.log('already');
          this.server.to(client.id).emit("already-ask");
          break;
        }
        return ;
    }
    for (let entry of gameQueueSmach)
    {
      if (entry.user.id === user)
      {
          console.log('already');
        this.server.to(client.id).emit("already-ask");
        break;
      }
      return ;
  }
      const allGame = await this.gameRepo.find( { } );

      for (let entry of allGame) {
          if ((entry.playerLeft === user || entry.playerRight === user) && entry.finish === false)
          {
            this.joinRoom(client, entry.id);
            const data = {roomname:entry.id, sL:entry.scoreLeft, sR:entry.scoreRight, player1:entry.playerLeft, player2:entry.playerRight, smash :entry.smash};
            this.server.to(entry.id).emit("game-start", data);
            return;
          }
      }
    }

    async matchMake(tabMatch, v)
    {
        let roomName;
        if(tabMatch.length % 2 === 0)//TODO 
        {       const details = {
                    playerLeft: tabMatch[0].user.id,
                    playerRight: tabMatch[1].user.id,
                    userLeft: tabMatch[0].user,
                    userRight: tabMatch[1].user,
                    smash : v,
                }
                const newGame = await this.gameRepo.save(details);
                roomName = newGame.id;
                this.joinRoom(tabMatch[0].sock, roomName);
                this.joinRoom(tabMatch[1].sock, roomName);
             //   this.joinRoom(gameQueue[1].sock, roomName);
             const data = {roomname: roomName, sL: 0, sR:0, player1: tabMatch[0].user.id, player2:tabMatch[1].user.id, smash: v}
             
                this.server.to(roomName).emit("game-start",  data);  
                const allSocketPlayer = await this.socketRepo.find({where:[{idUser: tabMatch[0].user.id}, {idUser: tabMatch[1].user.id}]});
                for (let entry of allSocketPlayer)
                {
                    if (entry.name != tabMatch[0].sock.id && entry.name != tabMatch[1].sock.id)
                        this.server.to(entry.name).emit("joinroom",  roomName);
                }
                tabMatch.splice(0,2);
        }
    }


    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, infos) {
        this.server.to(socket.id).emit("received");
        const tab = { sock: socket, user: infos[0] };
        if(!gameQueue.find(element => infos[0].id === element.user.id)
            && !gameQueueSmach.find(element => infos[0].id === element.user.id))
        {
            const allSocketPlayer = await this.socketRepo.find({where:{idUser: infos[0].id}});
            for (let entry of allSocketPlayer)
                    this.server.to(entry.name).emit("joinroom");
            if (infos[1] === 1) {
                gameQueueSmach.push(tab);
                this.matchMake(gameQueueSmach, infos[1]);
            }
            else {
                gameQueue.push(tab);
                this.matchMake(gameQueue, infos[1]);
            }
        }
        console.log('gq length', gameQueue.length);
        console.log('gqS length', gameQueueSmach.length);
        
    }

   
    @SubscribeMessage('moveDown')
    async  paddleDown(client, infos) { //infos[0]=userId, infos[1]=roomGameId, infos[2]=allPos
       // const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (infos[2].playerL === infos[0] )
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
        else if (infos[2].playerR === infos[0])
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
       // const idGame = await this.gameRepo.findOne({id:infos[1]});
        if (infos[2].playerL === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos - 10;
            if(newPos <= 0)
                newPos = 0;
            this.server.to(infos[1]).emit("left-move", newPos);
        }
        else if (infos[2].playerR === infos[0])
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
        //     this.server.to(infos[0]).emit("opponent-leave")

        /*date for game table*/
        const the_date: string = moment().tz("Europe/Paris").format('dddd Do MMM YY, hh:mm');
      
        let width = infos[1].width; 
        let height = infos[1].height; 
        var ballRadius = infos[1].ballRadius;
        var dx = infos[1].deltaX;
        var dy = infos[1].deltaY;
        var by = infos[1].ballY;
        var bx = infos[1].ballX;
        var sL = infos[1].scoreL;
        var sR = infos[1].scoreR;
        var newSleep = infos[1].sleep;
        var smachX = infos[1].smachX;
        var smachY = infos[1].smachY;

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }   
        var posL = infos[1].posHL;
        var posR = infos[1].posHR;
        var paddleW = infos[1].paddleLarge;
        var paddleH = infos[1].paddleSize;
        var speed = infos[1].speed;

        if (by >= infos[1].smachY - (height/30)/2 && by <= infos[1].smachY + (height/30)/2
            && bx >= infos[1].smachX - (height/30)/2 && bx <= infos[1].smachX + (height/30)/2)
        {
            var randomX = Math.floor(Math.random() * width - (width/8)) + width/8;
            var randomY = Math.floor(Math.random() * height - (height/8)) + height/8;
            speed = 3;
            dx = dx * speed;
            dy = dy * speed;
            smachX = randomX;
            smachY = randomY;
        }
        /* si la balle est sur les bord haut et bas du board */
        if((by + dy > height ) || (by + dy < 0)) {
            dy = -dy;
        } 
        
        /* si la balle touhce les bords du paddle */
        if ((bx < paddleW && posL <= by && posL + paddleH >= by) 
            || (bx > width - paddleW && posR <= by  &&  posR + paddleH >= by)) {
                dy = -dy / speed;
                dx = dx /speed;
                speed = 1;
            }
        /* si la balle touhce la longueur du paddle */
        else if ((bx === paddleW && posL <= by && posL + paddleH >= by) 
            || ((bx === width - paddleW && posR <= by && posR + paddleH >= by))) {
                dx = -dx / speed;
                dy = dy/speed;
                speed = 1;
        }
        bx = bx + dx;
        by = by + dy;

        if(bx > width) {
            sL += 1;
            bx = infos[1].width/2;
            by = infos[1].height/2;
            dx = dx / speed;
            dy = dy / speed;
            speed = 1;            
            newSleep = true;

        }
        if (bx < 0) {

            sR += 1;
            bx = infos[1].width/2;
            by = infos[1].height/2;
            dx = dx / speed;
            dy = dy/speed;
            speed = 1;
            newSleep = true;
        }
        if (newSleep === true) {
            let ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed: speed, smX : smachX, smY: smachY}
            this.server.to(infos[0]).emit("updatedBall", ball);
            await sleep(500);
            newSleep = false;
            ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed:speed, smX: smachX, smY:smachY}
            this.server.to(infos[0]).emit("updatedBall", ball);
            return;
        }
        let ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed : speed, smX: smachX, smY: smachY}
        this.server.to(infos[0]).emit("updatedBall", ball);
        if (sL >= 11 && sR < sL - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerLeft, looser:idGame.playerRight, finish:true, scoreLeft:sL, scoreRight:sR, date:the_date});

            const user = await this.userRepo.findOne({id: idGame.playerLeft});
            this.server.to(infos[0]).emit("game-stop", user.login);
            //Laura: update total_wins
            const update = await this.userRepo.findOne({where: [{ id: idGame.winner},],});
            update.total_wins+=1;
            this.userRepo.save(update);
        }
        if (sR >= 11 && sL < sR - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerRight, looser: idGame.playerLeft, finish:true, scoreLeft:sL, scoreRight:sR, date:the_date});

            const user = await this.userRepo.findOne({id: idGame.playerRight});
            this.server.to(infos[0]).emit("game-stop", user.login);
            //Laura: update total_wins
            const update = await this.userRepo.findOne({where: [{ id: idGame.winner},],});
            update.total_wins+=1;
            this.userRepo.save(update);
        }
    }
    @SubscribeMessage('updateScore')
    async updateScore(client, infos)
    {
        console.log(infos[1], infos[2]);
        this.gameRepo.update( {id : infos[0]}, {scoreLeft:infos[1], scoreRight:infos[2]});

    }

    @SubscribeMessage('abort-match')
    async abortMatch(client, infos)
    {
        if (!infos[0])
        {
            var i = 0;
            for (let entry of gameQueue)
            {
                if (entry.user.id === infos[3])
                {
                    gameQueue.splice(i, i+ 1);
                    break;
                }
                 i++;
            }
            i = 0;
            for (let entry of gameQueueSmach)
            {
                if (entry.user.id === infos[3])
                {
                    gameQueue.splice(i, i+ 1);
                    break;
                }
                 i++;
            }
            const allSocketPlayer = await this.socketRepo.find({where:{idUser: infos[3]}});
            for (let entry of allSocketPlayer)
                    this.server.to(entry.name).emit("opponent-quit");
            console.log('gqmeQueuLength', gameQueue.length);
            console.log('gqmeQueuSmachLength', gameQueueSmach.length);
            return ;
        }
        this.updateScore(client, infos);
        this.server.to(infos[0]).emit("opponent-quit");
    }


    @SubscribeMessage('finish-match')
    async endMatch(client, infos)
    {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve,ms));
        }
        await sleep(1000);
        if (!infos[0])
        {
            const allSocketPlayer = await this.socketRepo.find({where:{idUser: infos[1]}});
            for (let entry of allSocketPlayer)
                    this.server.to(entry.name).emit("restart");
            return;
        }
        const idGame = await this.gameRepo.findOne({id:infos[0]});

        this.gameRepo.update( {id : infos[0]}, {scoreLeft:idGame.scoreLeft, scoreRight:idGame.scoreRight, finish: true});
        this.server.to(infos[0]).emit("restart");
    }
}

