import FriendUserProfilExtended from "./FriendUserProfileExtended";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { useState } from "react";
import { socket } from "./Socket";

const DisplayUser = ({userConnected, userSelected}) => {

    //---
    const [reveleProfil, setReveleProfil] = useState(false);
    const toggleProfil = () => {setReveleProfil(!reveleProfil);}
    
    const beginChat = (friend) => {
    console.log('beginchat', userConnected);
    const roomname = friend.id < userConnected.id ? friend.id + '.' + userConnected.id : userConnected.id + '.' + friend.id;
    socket.emit('addsalon', userConnected.id, true, true, roomname);
    socket.emit('user_joins_room', {userId: userConnected.id, room: roomname, otherLogin: friend.login});

  };
    return(
       
                <div>
                  <p><svg width="48" height="40" viewBox='0 0 45 40'>
                  <foreignObject x="0" y="0" width="45" height="40" >
                    <div><img style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
                  </foreignObject>
                  <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={userSelected.color}></rect></svg>
                
                  {userSelected.login} | <MaterialIcon icon="person add" onClick={toggleProfil} /> | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> | Spectate | Defeat |<br></br></p>
                  <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
                    <FriendUserProfilExtended Value={userSelected.login}/>
                  </ModalWindow>
                </div>
    );
 };

 export default DisplayUser;
 
  