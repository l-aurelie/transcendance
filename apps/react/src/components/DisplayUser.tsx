//TODO: begin chat et friendRequest dans un service

import FriendUserProfilExtended from "./FriendUserProfileExtended";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { useState } from "react";
import { socket } from "./Socket";
import axios from "axios";

const DisplayUser = ({userConnected, userSelected, isFriend}) => {

    //---
    const [reveleProfil, setReveleProfil] = useState(false);
    const toggleProfil = () => {setReveleProfil(!reveleProfil);}
    
    const beginChat = (friend) => {
      console.log('beginchat', userConnected);
      const roomname = friend.id < userConnected.id ? friend.id + '.' + userConnected.id : userConnected.id + '.' + friend.id;
      socket.emit('addsalon', userConnected.id, true, true, roomname);
      socket.emit('user_joins_room', {userId: userConnected.id, room: roomname, otherLogin: friend.login});
    };

    const sendFriendRequest = event => {
        axios.get("http://localhost:3000/friends/friendRequest/send/" + userSelected.id, {withCredentials:true}).then((res) => {
        const mess = res.data.error;
        /*Si la fonction send a retourne un erreur ?*/
        if (typeof(mess) === 'string')
        {
            const str = JSON.stringify(mess);
            /*affiche l'erreur*/
            alert(str);
        }
        else
        /*sinon, tout s'est bien passe et on affiche le suivant:*/
            alert("Friend request sent");
        })
    }

    if(isFriend)
    {
      return(
        <div>
          <p><svg width="48" height="40" viewBox='0 0 45 40'>
          <foreignObject x="0" y="0" width="45" height="40" >
            <div><img  onClick={toggleProfil} style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
          </foreignObject>
          <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={userSelected.color}></rect></svg>
        
          <p style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p> | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> | Spectate | Defeat |<br></br></p>
          <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
            <FriendUserProfilExtended Value={userSelected.login}/>
          </ModalWindow>
        </div>
      );
    }
    else
    {
      return(
        <div>
          <p><svg width="48" height="40" viewBox='0 0 45 40'>
          <foreignObject x="0" y="0" width="45" height="40" >
            <div><img  onClick={toggleProfil} style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
          </foreignObject>
          <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={userSelected.color}></rect></svg>
        
          <p className="linkLog" style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p>| <MaterialIcon icon="person add" onClick={sendFriendRequest} /> | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> | Spectate | Defeat |<br></br></p>
          <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
            <FriendUserProfilExtended Value={userSelected.login}/>
          </ModalWindow>
        </div>
      );
    }
 };

 export default DisplayUser;
 
  