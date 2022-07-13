//TODO: begin chat et friendRequest dans un service

import FriendUserProfilExtended from "./FriendUserProfileExtended";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { useEffect, useState } from "react";
import { socket } from "./Socket";
import axios from "axios";
import Defeat from "./Defeat";

const DisplayUser = ({userConnected, userSelected, isFriend}) => {
    //---
    const [reveleProfil, setReveleProfil] = useState(false);
    const toggleProfil = () => {setReveleProfil(!reveleProfil);}
    //---
    const [reveleDefeat, setReveleDefeat] = useState(false);
    const toggleDefeat = () => {setReveleDefeat(!reveleDefeat);}
    
    /* Lancer un message prive */
    const beginChat = (friend) => {
      console.log('beginchat', userConnected);
      const roomname = friend.id < userConnected.id ? friend.id + '.' + userConnected.id : userConnected.id + '.' + friend.id;
      socket.emit('addsalon', userConnected.id, true, true, roomname, friend.login);
     // socket.emit('user_joins_room', {userId: userConnected.id, room: roomname, otherLogin: friend.login});
    };

    /* Ajouter en ami */
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

//set version of game whern defeat someone and send the request to other user
const defeat = () => {
  socket.emit('defeat', userConnected, userSelected, 0);
  toggleDefeat();
}

    /* Affiche un user et toute les options associee. Regarder le profil, add(si pas amis), chat, etc... */
    if(isFriend)
    {
      return(
        <div>
          <p><svg width="48" height="40" viewBox='0 0 45 40'>
          <foreignObject x="0" y="0" width="45" height="40" >
            <div><img  onClick={toggleProfil} style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
          </foreignObject>
          <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={userSelected.color}></rect></svg>
        
          <p style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p> 
          | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> 
          | <MaterialIcon icon="star" onClick={defeat} /> 
          |Spectate <br></br></p>
          <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
            <FriendUserProfilExtended Value={userSelected.login}/>
          </ModalWindow>
          <ModalWindow revele={reveleDefeat} setRevele={toggleDefeat}>
            <Defeat toggle={toggleDefeat} opponent={userSelected} actual={userConnected} version={0}></Defeat>
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
        
          <p className="linkLog" style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p> 
          | <MaterialIcon icon="person add" onClick={sendFriendRequest} /> 
          | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> 
          | <MaterialIcon icon="star" onClick={defeat} /> | Spectate <br></br></p>
          <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
            <FriendUserProfilExtended Value={userSelected.login}/>
          </ModalWindow>
          <ModalWindow revele={reveleDefeat} setRevele={toggleDefeat}>
            <Defeat toggle={toggleDefeat} opponent={userSelected} actual={userConnected} version={0}></Defeat>
          </ModalWindow>
        </div>
      );
    }
 };

 export default DisplayUser;
 
  