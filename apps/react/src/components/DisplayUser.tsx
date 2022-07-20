//TODO: begin chat et friendRequest dans un service

import FriendUserProfilExtended from "./FriendUserProfileExtended";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
import MaterialIcon from 'material-icons-react';
import { useState } from "react";
import { socket } from "./Socket";
import axios from "axios";


const  DisplayUser = ({userConnected, userSelected, isFriend, togglePlay, togglePlay2}) => {
    //---
    const [reveleProfil, setReveleProfil] = useState(false);
    const toggleProfil = () => {setReveleProfil(!reveleProfil);}
    const [color, setColor] = useState(userSelected.color);
    const [playing, setPlaying] = useState(userConnected.color === 'rgba(255, 0, 255, 0.9)');
    //---
    const [bloc, setBlock] = useState(false);
    axios.get("http://localhost:3000/users/getColor/" + userSelected.id, {withCredentials:true}).then((res) =>{
      console.log(res.data);   
      setPlaying(res.data === 'rgba(255, 0, 255, 0.9)');
          setColor(res.data)
       });
     axios.get("http://localhost:3000/users/isBlock/" +  userConnected.id + "/"+ userSelected.id, {withCredentials:true}).then((res) => {
      if (res.data === false)
      {
      setBlock(false);
      }
      else{
      setBlock(true);
      }
    });
    socket.on("changeColor", data => {
      axios.get("http://localhost:3000/users/getColor/" + userSelected.id, {withCredentials:true}).then((res) =>{
      console.log(res.data);   
      setPlaying(res.data === 'rgba(255, 0, 255, 0.9)');
          setColor(res.data)
       });
    });
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
        else {
            socket.emit('friendrequestnotif', {id: userSelected.id, new: true});
        /*sinon, tout s'est bien passe et on affiche le suivant:*/
            alert("Friend request sent");
        }
        })
    }

//set version of game whern defeat someone and send the request to other user
const defeat = () => {
  socket.emit('defeat', userConnected, userSelected.id, 0);
  togglePlay();
}
const block = () => {
  axios.get("http://localhost:3000/users/setBlock/" + userConnected.id + "/"+ userSelected.id, {withCredentials:true}).then((res) => {
    setBlock(true);
    socket.emit("just-block", userConnected);
  })
}
const watch = () => {
    socket.emit("watch-friend", userSelected.id, userConnected);
    togglePlay2();
}

const  unblock = () => {
  axios.get("http://localhost:3000/users/setUnblock/" + userConnected.id + "/"+ userSelected.id, {withCredentials:true}).then((res) => {
    setBlock(false);
    socket.emit("just-block", userConnected);
  })
  }

  

    /* Affiche un user et toute les options associee. Regarder le profil, add(si pas amis), chat, etc... */
    if(isFriend)
    {
      return(
        <div>
          <div><svg width="48" height="40" viewBox='0 0 45 40'>
          <foreignObject x="0" y="0" width="45" height="40" >
            <div><img  onClick={toggleProfil} style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
          </foreignObject>
          <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={color}></rect></svg>
        
          <p style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p> 
          | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> 
          | <MaterialIcon icon="videogame_asset" onClick={defeat} />
          | {bloc ? <i onClick={unblock} ><MaterialIcon icon="block"/>(Unblock)</i> : <i onClick={block}><MaterialIcon icon="block"/>(Block)</i>}
          | {playing ? <i onClick={watch}><MaterialIcon icon="connected_tv"/></i> : <></>}
          {/* |Spectate <br></br> */}
          </div>
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
          <div><svg width="48" height="40" viewBox='0 0 45 40'>
          <foreignObject x="0" y="0" width="45" height="40" >
            <div><img  onClick={toggleProfil} style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={userSelected.avatar}/></div>
          </foreignObject>
          <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={userSelected.color}></rect></svg>
        
          <p className="linkLog" style={{display: "inline", textDecoration: "underline"}} onClick={toggleProfil}>{userSelected.login}</p> 
          | <MaterialIcon icon="person_add" onClick={sendFriendRequest} /> 
          | <MaterialIcon icon="chat" onClick={() => {beginChat(userSelected)}} /> 
          | <MaterialIcon icon="videogame_asset" onClick={defeat} /> {/*icon="star"*/}
          |{bloc ? <i onClick={unblock} ><MaterialIcon icon="block"/>(Unblock)</i> : <i onClick={block}><MaterialIcon icon="block"/>(Block)</i>}
          | {playing ? <i onClick={watch}><MaterialIcon icon="connected_tv"/></i> : <></>}
           {/* | Spectate <br></br> */}
           </div>
          <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
            <FriendUserProfilExtended Value={userSelected.login}/>
          </ModalWindow>
        </div>
      );
    }
 };

 export default DisplayUser;
 
  