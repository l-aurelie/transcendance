import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Socket= () => {

    const [socket2, setSocket2] = useState(null);
    const [response, setResponse] = useState("");
    const [message, setMessage] = useState("");
    // instance of websocket connection as a class property

   useEffect(() => {
        const socket = socketIOClient('http://localhost:3000');
        setSocket2(socket);
        console.log('in');
        socket.on("users", data => {
           setResponse(data);
           console.log(socket.id);
          });
        socket.on('chat', message => {
            console.log(message);
        })
        socket.emit('chat', 'okok');
        }, []);

    //useEffect(() => {
     //   socket.on('chat', message_in => {
      //      setMessage(message);
       // })
        //socket.emit('chat', 'okok');
        //}, []);
  
    return (
        <p>
            It's <time dateTime={response}>{response}</time>
        </p>
        );

    }



// const Socket = () => {

//     const [socket, setSocket] = useState(null);
//   const [socketConnected, setSocketConected] = useState(false);

//   /* Establish socket connection */
//   useEffect(() => {
//       setSocket(io('http://localhost:3000', {
//         withCredentials: true,
//         }));
//   }, []);

//   /* Subscribe to the socket event */
//   useEffect(() => {
//       if (!socket) {
//           return
//       }
//       socket.on('connect', () => {
//           setSocketConected(socket.connected);
//       });
//       socket.on('disconnect', () => {
//           setSocketConected(socket.connected);
//       });
//   }, [socket])

//   /* Manage socket connection */ 
//   const handleSocketConnection = () => {
//       if (socketConnected) {
//           socket.disconnect();
//       } else {
//           socket.connect();
//       }
//   }

//   // const getNbUsers = () => {
//   // 	socket.emit('')
//   // }
//   return (
//       <div>
//     <div><b>Connection status:</b> {socketConnected ? 'Connected' : 'Disconnected'}</div>
//     <input
//       type="button"
//       style={{ marginTop: 10 }}
//       value={socketConnected ? 'Disconnect' : 'Connect'}
//       onClick={handleSocketConnection} />

//     </div>
//   );
// }
  export default Socket