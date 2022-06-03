import React from "react";
import { Component } from "react";
import UserProfil from "../components/UserProfil";

class Socket extends Component {


    // instance of websocket connection as a class property
    ws = new WebSocket('ws://localhost:3000/ws')

    componentDidMount() {
        this.ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
        }

        this.ws.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        this.setState({dataFromServer: message})
        console.log(message)
        }

        this.ws.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss

        }

    }

   render(){
        return <div>{UserProfil}</div>
    }
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