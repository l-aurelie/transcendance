/* https://www.joshmorony.com/creating-a-simple-live-chat-server-with-nestjs-websockets/ */

import {
    WebSocketGateway,
    WebSocketServer, 
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';

// this decorator will allow us to make use of the socket.io functionnalitu
@WebSocketGateway({ cors: '*:*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // We set up a variable 'server' with the decorator which will give us access to the server instance
    // we then can use this to trigger events and send data to connected clients
    @WebSocketServer() server;
    users: number = 0;
    


    // The handle connection hooks will keep track of clients connections and disconnection
    async handleConnection() {
        // A client has connected
        this.users++;
        console.log(this.users);
        console.log(this.server.sockets);
        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    async handleDisconnect() {
        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    // this decorator is used to listenning incomming messages.
    @SubscribeMessage('chat')
    // param 'client' will be a reference to the socket instance, param 'message' will be te data sent by the client
    async onChat(client, message) {
        //any clients listenning  for the cht event would receivethis data instantly
        //client.broadcast.emit('chat', message);
        this.server.emit('chat', message);
    }
}