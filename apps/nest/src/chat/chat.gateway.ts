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
import { Socket, User, RoomEntity, Message, Games, RoomUser, UserBlock } from 'src/typeorm';
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
        @InjectRepository(UserBlock) private userBlockRepo: Repository<UserBlock>,
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
      
        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    async handleDisconnect(client) {
        const the_date = moment().tz("Europe/Paris").format('dddd Do MMM YY, hh:mm');
console.log('handleDisconnect');
        // A client has disconnected
        this.users--;
        await this.disconnectGame(client, the_date);
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
    @SubscribeMessage('logout')
    async logOut(client, infos) {
       this.server.to('sockets' + infos.userId).emit('logout');

    }
    @SubscribeMessage('disco')
    async disconnect(client) {
        client.disconnect();

    }
    //--------------------------------------------------------------------------------------------//
    //----------------------------------CHAT------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//

    /* Recupere tous les salon publics existants dans la db */
    @SubscribeMessage('fetchsalon')
    async fetch_salon(client) {
        const salons = await this.roomRepo.find({where: { private : false }});
        client.emit('fetchsalon', salons);
     }

     /* Recupere tous les messages de la table RoomId [room] sauf ceux des utilisateurs bloqués et les formatte pour l'affichage, les emit au front */
     /* {nameSalon: currentSalon.name, idUser: props.actualUser.id} */
     @SubscribeMessage('fetchmessage')
     async fetch_message(client, data) {
        const message = await this.messageRepo.find({relations: ["sender"], where: { roomID : await this.roomService.getRoomIdFromRoomName(data.nameSalon) }});
        /* Récupération de l'id des users bloqués par le client dans un tableau*/
        const blockedUsers = await this.userBlockRepo.find({where: {blockingUserId: data.idUser}});
        const arrayBlockedUsers = blockedUsers.map((it) => it.blockedUserId);
        /* Concatene userName et le contenu du message si celui ci n'a pas été envoyé par quelqu'un de bloqué*/
        let tab = [];
        for (let entry of message)
        {
                if (arrayBlockedUsers.includes(entry.sender.id))
                   break;
                const roomUser = await this.roomUserRepo.findOne({where: {userId:entry.senderId, roomId:data.roomId}});
                if (roomUser.mute === false)
                {
                    tab.push({id: entry.id, sender: entry.sender.id, message: entry.content, senderLog: entry.sender.login})
                }
            }
        /*tab = await Promise.all(message.map( async (it) : Promise<any[]> => {
                if (arrayBlockedUsers.includes(it.sender.id))
                   return tab;
                return [...tab, it.sender.login + ' : ' + it.content];
             }));*/
console.log(tab);
tab = tab.sort((a,b) => a.id- b.id);
console.log(tab);
        client.emit('fetchmessage', tab);
      }

    /* Un user join une room ou crée une conversation privée, on cree une entre userRoom */
    /* {userId: props.user.id, room: roomname, otherLogin: friend.login} */
     @SubscribeMessage('user_joins_room')
     async user_joins_room(client, infos) {
        if(infos.roomId)
        {
            const roomUser = await this.roomUserRepo.findOne({where: {userId:infos.userId, roomId:infos.roomId}});
                if (roomUser && roomUser.ban === true)
                {
                    console.log('bann = true');
                    return;
                }
        }
    /* On fait rejoindre au client la room débutant par le mot clé salonRoom pour éviter les conflits */
       this.server.in('sockets' + infos.userId).socketsJoin('salonRoom' + infos.room);
    /* On communique au front le nom d'affichage : soit le nom du salon soit le login du friend si c'est un dm */
       const dm = !(!infos.otherLogin);
       let adm = false;
       var displayName = infos.otherLogin;
        const theRoom = await this.roomRepo.findOne({ name : infos.room });
           if (!dm) {
           displayName = infos.room;
           const theUser = await this.userService.findUserById(infos.userId);
           const joinedRoomId = await this.roomService.getRoomIdFromRoomName(infos.room);
           let myUserRoom = await this.roomUserRepo.findOne({userId: infos.userId, user: theUser, roomId: infos.roomId});
           if (!myUserRoom)
           {
               const getNewUserRoom = {id: null, userId: infos.userId, user: theUser, room: theRoom, roomId: infos.roomId, mute: false,
                   ban: false, isAdmin: false, expireBan: null, expiredMute: null};
                myUserRoom = await this.roomUserRepo.save(getNewUserRoom);
            }
        adm = myUserRoom.isAdmin;
       }
       /* On emit le nom du salon ajoute pour afficher dans les front de chaque socket du user */
       this.server.to('sockets' + infos.userId).emit('joinedsalon', {salonName: infos.room, dm: dm, displayName: displayName, roomId:infos.roomId, isAdmin:adm, creator: theRoom.creatorId});
       
    }

    /* Un user quitte la room, on supprime une entre userRoom */
    @SubscribeMessage('user_leaves_room')
    async user_leaves_room(client, infos) {
      await this.roomUserRepo.createQueryBuilder().delete().where({ userId: infos.userId, roomId: await this.roomService.getRoomIdFromRoomName(infos.room) }).execute();
      this.server.in('sockets' + infos.userId).socketsLeave('salonRoom' + infos.room);
      /* On emit le nom du salon quitté pour en informer tous les fronts */
      this.server.to('sockets' + infos.userId).emit('leftsalon', infos.room)
    }

    /* Recoit un message et un room dans laquelle re-emit le message */
    /* {roomToEmit: currentSalon.name, message : event.target.value, whoAmI: actualUser, isDm: currentSalon.isDm} */
    @SubscribeMessage('chat')
    async onChat(client, data) {
        //any clients listenning  for the chat event on the data.roomToEmit channel would receive the message data instantly
        const time = new Date(Date.now()).toLocaleString();
        await this.messageService.addMessage(data.message, data.roomToEmit, data.whoAmI.id); 
        if (!data.isDm)
        {
            const roomUser = await this.roomUserRepo.findOne({where: {userId:data.whoAmI.id, roomId:data.roomId}});
            if (roomUser.mute === true)
                return;
        }
        /* on récupère les infos de block */
        /* on fait un array constitué de tous les salons de sockets qui nous ont blouqués pour ne pas leur emit grâce à .except */
        let bannedMe = await this.userBlockRepo.createQueryBuilder().where({ blockedUserId: data.whoAmI.id }).execute();
        bannedMe.forEach(function(el, id, arr) {
            arr[id] = 'sockets' + arr[id].UserBlock_blockingUserId;
        });
        console.log('client Blocked by ;', bannedMe);
        /* on emit seulement aux sockets des 2 users si c'est un dm, sinon à tout le salon */
        if (data.isDm) {
            const otherUserId = data.roomToEmit.endsWith(data.whoAmI.id) ? data.roomToEmit.split('.')[0] : data.roomToEmit.split('.')[1];
          //  this.server.to('sockets' + otherUserId).except(bannedMe).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, displayName: data.whoAmI.login});
          //  this.server.to('sockets' + data.whoAmI.id).emit('chat', {emittingRoom: data.roomToEmit,sender: data.whoAmI.id, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, dontNotif: true});
            this.server.to('sockets' + otherUserId).except(bannedMe).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, senderLog:data.whoAmI.login, message: data.message, displayName: data.whoAmI.login, roomId:data.roomId, creator:data.creator});
            this.server.to('sockets' + data.whoAmI.id).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, senderLog:data.whoAmI.login, message: data.message, dontNotif: true, roomId:data.roomId, creator:data.creator});
        }
        else {
            bannedMe.push('sockets' + data.whoAmI.id);
         //   this.server.to('salonRoom' + data.roomToEmit).except(bannedMe).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, displayName: data.roomToEmit});
            //on coupe en deux avec un broadcast et un server.to(mysockets) pour différencier notifs et pas notifs
         //   this.server.to('sockets' + data.whoAmI.id).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, message: '[' + data.whoAmI.login + '] ' +  '[' + time + '] ' + data.message, displayName: data.roomToEmit, dontNotif: true});
         this.server.to('salonRoom' + data.roomToEmit).except(bannedMe).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, senderLog:data.whoAmI.login, message: data.message, displayName: data.roomToEmit, roomId:data.roomId, creator:data.creator});
         this.server.to('sockets' + data.whoAmI.id).emit('chat', {emittingRoom: data.roomToEmit, sender: data.whoAmI.id, senderLog:data.whoAmI.login, message: data.message, displayName: data.roomToEmit, dontNotif: true, roomId:data.roomId, creator:data.creator});
        }
    }

    @SubscribeMessage('whoAmI')
    async linkUserSocket(client, user) {
      const sock = this.socketRepo.create();
      sock.name = client.id;
      sock.user = user;
      sock.idUser = user.id;
      await this.socketRepo.save(sock);
      if (user.isPlaying === true)
        await this.userRepo.update({id:user.id}, {isConnected:true, color:'rgba(255, 0, 255, 0.9'});
      else
        await this.userRepo.update({id:user.id}, {isConnected:true, color:'rgba(0, 255, 0, 0.9'});
      this.server.emit('changeColor');
      /* on join la room avec tous les sockets du user, elle s'appelera par exemple sockets7 pour l'userId 7 */
      client.join('sockets' + user.id);
      /* on boucle sur les roomUser pour faire rejoindre à ce socket toutes les rooms du user, hors dm car pas besoin de les rejoindre (communication socket à socket) */
      console.log('pbquery?');
      const rooms = await this.roomUserRepo.createQueryBuilder().where({ userId: user.id }).execute();
      console.log('rooms = ', rooms);
      for (let room of rooms) {
          var roomName = await this.roomService.getRoomNameFromId(room.RoomUser_roomId);
          /* on emit au nouveau socket tous ses salons rejoints, et on les lui fait rejoindre */
      //    console.log('A');
       //   client.emit('joinedsalon', {salonName: roomName, dm: false, displayName: roomName, roomId:room.RoomUser_roomId, isAdmin:room.RoomUser_isAdmin});
       //   console.log('B');
        //  console.log("salonName ==> ", roomName, "dm ==> :", false, "displayName ==> ", roomName, "roomId: ==> ", room.RoomUser_roomId, "isAdmin ==> ", room.RoomUser_isAdmin);
          client.join('salonRoom' + roomName);
      }
    }

    // event d'emit d'ajout de salon pour affichage dynamique dans le menu AddSalon
    // /!\ Rien n'écoute l'event newsalon pour l'instant, le re-emit est donc inutile
    @SubscribeMessage('addsalon')
    async addsalon(client, infos) {
        const newRoom = await this.roomService.createRoom(infos[0], infos[1], infos[2], infos[3]);
        console.log (newRoom.id)
        const roomUser = await this.roomService.associateUserRoom(newRoom, infos[0], infos[1], infos[2], true);
        await this.roomUserRepo.update({id: roomUser.id}, {isAdmin:true});
        console.log('roomuserId= ', roomUser.id, roomUser.roomId, roomUser.userId, infos[0]);
        // await this.roomRepo.update({id:newRoom.id}, {creatorId:infos[0]})
        if (!infos[1]) {
            this.server.emit('newsalon', infos[3]);
            this.server.to('sockets' + infos[0]).emit('joinedsalon', {salonName: infos[3], dm: false, displayName: infos[3], roomId:newRoom.id, creator:infos[0], isAdmin:true}); // add owner = true;
        }
    }

    @SubscribeMessage('changeInfos')
    async changeInfos(client, userId) {
        this.server.to('sockets'+ userId).emit('changeInfos');
    }

    //--------------------------------------------------------------------------------------------//
    //----------------------------------GAME------------------------------------------------------//
    //--------------------------------------------------------------------------------------------//
    
    @SubscribeMessage('initGame')
    async initGame( client, user)
    {
        for (let entry of gameQueue) {
        if (entry.user.id === user) {
          this.server.to(client.id).emit("already-ask");
          break;
        }
        return ;
    }
    for (let entry of gameQueueSmach) {
      if (entry.user.id === user) {
        this.server.to(client.id).emit("already-ask");
        break;
      }
      return ;
    }
      const allGame = await this.gameRepo.find( { } );
      for (let entry of allGame) {
          if ((entry.playerLeft === user || entry.playerRight === user) && entry.finish === false) {
            this.joinRoom(client, entry.id);
            const data = {roomname:entry.id, sL:entry.scoreLeft, sR:entry.scoreRight, player1:entry.playerLeft, player2:entry.playerRight, smash :entry.smash};
            this.server.to(entry.id).emit("game-start", data);
            this.server.to(entry.id+'-watch').emit("game-start", data);
            await this.userRepo.update({id:user.id}, {isConnected:true, color:'rgba(255, 0, 255, 0.9'});
            this.server.emit('changeColor');
            console.log('passe dans init');
            return;
          }
      }
    }

    async launchMatch(userL, userR, v)
    {
        let roomName;
        const details = {
            playerLeft: userL.id,
            playerRight: userR.id,
            userLeft: userL,
            userRight: userR,
            smash : v,
        }
        const newGame = await this.gameRepo.save(details);
        await this.userRepo.update({id:userL.id}, {isPlaying:true, color:'rgba(255, 0, 255, 0.9'});
        await this.userRepo.update({id:userR.id}, {isPlaying:true, color:'rgba(255, 0, 255, 0.9'});
        this.server.emit('changeColor');
        roomName = newGame.id;
        this.server.to('sockets'+userL.id).to('sockets'+userR.id).emit("joinroom",  roomName);
     const data = {roomname: roomName, sL: 0, sR:0, player1: userL.id, player2: userR.id, smash: v}
     this.server.to('sockets'+userL.id).to('sockets'+userR.id).emit("game-start",  data);  

    }

    async matchMake(tabMatch, v)
    {
        if(tabMatch.length % 2 === 0) 
        {      
            this.launchMatch(tabMatch[0].user, tabMatch[1].user, v);
            tabMatch.splice(0,2);
        }
    }

    @SubscribeMessage('acceptMatch')
    async acceptMatch(client, infos) {
        this.launchMatch(infos[0], infos[1], infos[2]);
    }

    @SubscribeMessage('warnOpponent')
    async warnOpponent(client, infos) {
        this.server.to('sockets' + infos).emit("noMoreMatch");
    }

    @SubscribeMessage('rejectMatch')
    async rejectMatch(client, infos) {
        console.log('arrive dans reject');
        this.server.to('sockets' + infos[0].id).emit("opponent-quit");
    }

    @SubscribeMessage('createGame')
    // param 'client' will be a reference to the socket instance, param 'data.p1' is the room where to emit, data.p2 is the message
    async createNewGame(socket: Socket, infos) {
        const tab = { sock: socket, user: infos[0] };
        if(!gameQueue.find(element => infos[0].id === element.user.id)
            && !gameQueueSmach.find(element => infos[0].id === element.user.id))
        {
            this.server.to('sockets'+ infos[0].id).emit("joinroom");
            if (infos[1] === 1) {
                gameQueueSmach.push(tab);
                this.matchMake(gameQueueSmach, infos[1]);
            }
            else {
                gameQueue.push(tab);
                this.matchMake(gameQueue, infos[1]);
            }
        }
        
    }

    @SubscribeMessage('moveDown')
    async  paddleDown(client, infos) { //infos[0]=userId, infos[1]=roomGameId, infos[2]=allPos
        if (infos[2].playerL === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos + 10;
            if(newPos + infos[2].paddleSize >= infos[2].height)
                newPos = infos[2].height - infos[2].paddleSize;
            this.server.to(infos[1]).emit("left-move", newPos);
            this.server.to(infos[1]+'-watch').emit("left-move", newPos);
        }
        else if (infos[2].playerR === infos[0])
        {
            const pos = infos[2].posHR;
            let newPos = pos + 10;
            if(newPos + infos[2].paddleSize >= infos[2].height)
                newPos = infos[2].height - infos[2].paddleSize;
            this.server.to(infos[1]+'-watch').emit("right-move", newPos);
            this.server.to(infos[1]).emit("right-move", newPos);
        }
    }

    @SubscribeMessage('moveUp')
    async  paddleUp(client, infos) { //infos[0] == userId, infos[1] == roomGameId , infos[2] == allPos
        if (infos[2].playerL === infos[0] )
        {
            const pos = infos[2].posHL;
            let newPos = pos - 10;
            if(newPos <= 0)
                newPos = 0;
            this.server.to(infos[1]).emit("left-move", newPos);
            this.server.to(infos[1]+'-watch').emit("left-move", newPos);
        }
        else if (infos[2].playerR === infos[0])
        {
            const pos = infos[2].posHR;
            let newPos = pos - 10;
            if(newPos <= 0)
                newPos = 0;
            this.server.to(infos[1]).emit("right-move", newPos);
            this.server.to(infos[1]+'-watch').emit("right-move", newPos);
        }
    }

    @SubscribeMessage('ball')
    async  updateBallX(server, infos) { //infos[0] == roomName , infos[1] = allPos
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
        var login;


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
            await this.gameRepo.update( {id : infos[0]}, {scoreLeft:sL});
        }
        if (bx < 0) {
            sR += 1;
            bx = infos[1].width/2;
            by = infos[1].height/2;
            dx = dx / speed;
            dy = dy/speed;
            speed = 1;
            newSleep = true;
            await this.gameRepo.update( {id : infos[0]}, {scoreRight:sR});
        }
        if (sL >= 11 && sR < sL - 1) {
            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerLeft, looser:idGame.playerRight, finish:true, scoreLeft:sL, scoreRight:sR, date:the_date});
            const user = await this.userRepo.findOne({id: idGame.playerLeft});
login = user.login;
this.server.to(infos[0]+'-watch').emit("game-stop", user.login);
this.server.to(infos[0]).emit("game-stop", user.login);
           // const update = await this.userRepo.findOne({where: [{ id: idGame.winner},],});
            const win = (await this.gameRepo.find({where: {winner:idGame.playerLeft}})).length;
            await this.userRepo.update({id: idGame.playerLeft}, {total_wins:win});
            // if (update)
            // {
            // update.total_wins = (update.total_wins + 1);
            //     this.userRepo.save(update);
            // }
        }
        if (sR >= 11 && sL < sR - 1) {

            const idGame = await this.gameRepo.findOne({id:infos[0]});
            this.gameRepo.update( {id : infos[0]}, {winner: idGame.playerRight, looser: idGame.playerLeft, finish:true, scoreLeft:sL, scoreRight:sR, date:the_date});
            const user = await this.userRepo.findOne({id: idGame.playerRight});

            login = user.login;
        this.server.to(infos[0]+'-watch').emit("game-stop", user.login);
          this.server.to(infos[0]).emit("game-stop", user.login);
          const win = (await this.gameRepo.find({where: {winner:idGame.playerRight}})).length;
            await this.userRepo.update({id: idGame.playerRight}, {total_wins:win});
            // const update = await this.userRepo.findOne({where: [{ id: idGame.winner},],});
            // if (update)
            // {
            //     update.total_wins = (update.total_wins + 1);
            // this.userRepo.save(update);

            // }
        }
        if (newSleep === true) {
            let ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed: speed, smX : smachX, smY: smachY, login : login}
            this.server.to(infos[0]+'-watch').emit("updatedBall", ball);
            this.server.to(infos[0]).emit("updatedBall", ball);
            await sleep(500);
            newSleep = false;
            ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed:speed, smX: smachX, smY:smachY, login: login}
            this.server.to(infos[0]+'-watch').emit("updatedBall", ball);
            this.server.to(infos[0]).emit("updatedBall", ball);
        }
        else {
            let ball = {x : bx, y: by, scoreLeft: sL, scoreRight: sR, dx:dx, dy:dy, sleep: newSleep, speed : speed, smX: smachX, smY: smachY, login: login}
            this.server.to(infos[0]).emit("updatedBall", ball);
            this.server.to(infos[0]+'-watch').emit("updatedBall", ball);
        }
    }

    @SubscribeMessage('updateScore')
    async updateScore(client, infos)
    {
        console.log('update score', infos);
        await this.gameRepo.update( {id : infos[0]}, {scoreLeft:infos[1], scoreRight:infos[2]});
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
            this.server.to('sockets' + infos[3]).emit("opponent-quit");
     
            return ;
        }
        await this.gameRepo.update( {id : infos[0]}, {scoreLeft:infos[1], scoreRight:infos[2], abort:true});
      //  await this.updateScore(client, infos);
        this.server.to(infos[0]).emit("opponent-quit");
        this.server.to(infos[0]+'-watch').emit("opponent-quit");
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
            this.server.to('sockets'+ infos[1]).emit("restart");
            return;
        }
        const idGame = await this.gameRepo.findOne({id:infos[0]});
        this.gameRepo.update( {id : infos[0]}, {scoreLeft:idGame.scoreLeft, scoreRight:idGame.scoreRight, finish: true});
        await this.userRepo.update({id: idGame.playerLeft}, {isPlaying:false, color:'rgba(0,255,0,0.9)'});
        await this.userRepo.update({id: idGame.playerRight}, {isPlaying:false, color:'rgba(0,255,0,0.9)'});
        this.server.emit('changeColor');
        this.server.to(infos[0]).emit("restart"); // a la fin d' un match, tout les joueurs ont leur jeu reset
        this.server.to(infos[0]+'-watch').emit("restart"); //a la fin d' un match, tout les spectateurs ont leur jeu reset
        this.server.to(infos[0]+'-watch').emit("leaveroom", infos[0]+'-watch'); //a la fin d' un match, tout les spectateur quittent la room qu'ils ecoutaient
        this.server.to(infos[0]).emit("leaveroom", infos[0]); //a la fin d' un match, tout les joueurs quittent la room qu'ils ecoutaient
    }

    @SubscribeMessage('watch-match')
    async watchMatch(client, infos) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const idGame = await this.gameRepo.findOne({relations: ["userLeft", "userRight"], where : {id:infos[0]}});
        if (idGame.finish === true)
        {
            this.server.to(client.id).emit("end-before-watch");
            await sleep(1000);
            this.server.to(client.id).emit("restart");
            return ;
        }
        const userL = idGame.userLeft.login;
        const userR = idGame.userRight.login;
        const watchRoom = infos[0] + '-watch';
        this.joinRoom(client, watchRoom);
        const data = {watchRoom: watchRoom, loginL:userL, loginR:userR}
        this.server.to(watchRoom).emit('watch', data);
    }
    @SubscribeMessage('defeat')
    async defeat(client, infos) {
        this.server.to('sockets'+infos[0].id).emit('defeat', infos[1]);
        const data = {user:infos[0], version:infos[2] };
        console.log('smash = ', infos[2])
        this.server.to('sockets'+infos[1]).emit('ask-defeat', data);
    }

    async twoPlayerDisconnect(the_date, entry, opponent)
    {
        const user2 = await this.socketRepo.find({where: {idUser: opponent}});
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
            await this.gameRepo.update( {id : entry.id}, {/*winner: win, looser:loose,*/ date: the_date, finish: true, abort:true});
            await this.userRepo.update({id:entry.playerLeft}, {isPlaying:false, color:'rgba(0,255,0,0.9)'});
            await this.userRepo.update({id:entry.playerRight}, {isPlaying:false, color:'rgba(0,255,0,0.9)'});
            this.server.emit('changeColor');
            this.server.to(entry.id+'-watch').emit("leaveroom", entry.id+'-watch');
            this.server.to(entry.id+'-watch').emit("restart");
            this.server.to(entry.id).emit("restart");

        }
    }

    async deleteQueue(tab, userId)
    {
        var i = 0;
        for (let entry of tab) {
            if (entry.user.id === userId) {
                tab.splice(i, i+1);
                break;
            }
            i++;
        }
    }

    async disconnectGame(client, the_date)
    {
        const whichuser = await this.socketRepo.findOne({where: {name:client.id}});
        if(whichuser)
        {
            const isUser = await this.socketRepo.find({where: {idUser: whichuser.idUser}});
            if (isUser.length === 1)
            {
                await this.userRepo.update({id:whichuser.idUser}, {isConnected:false, color:'rgba(255, 0, 0, 0.9'});
                this.server.emit('changeColor');
                console.log('only one socket');
                this.deleteQueue(gameQueue, whichuser.idUser);
                this.deleteQueue(gameQueueSmach, whichuser.idUser);
       
               const room = await this.gameRepo.find({where: [{playerLeft:whichuser.idUser, finish:false}, {playerRight:whichuser.idUser, finish: false}]});
               for (let entry of room)
                {
                    this.server.to(entry.id).emit("opponent-leave");
                    this.server.to(entry.id+'-watch').emit("opponent-leave");
                    if (whichuser.idUser === entry.playerLeft)
                        await this.twoPlayerDisconnect(the_date, entry, entry.playerRight);
                    else if (whichuser.idUser === entry.playerRight)
                        await this.twoPlayerDisconnect(the_date, entry, entry.playerLeft);
                }
            }
        }
    }
}

