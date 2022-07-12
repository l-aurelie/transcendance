import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {socket} from './Socket';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import FriendUserProfilExtended from './FriendUserProfileExtended';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import DisplayUser from './DisplayUser';

const lists = {
  // overflowY: 'scroll'
  overflowY: "scroll" as "scroll"
}

const AddFriend = (props) => {
const onChange = (event) => {
    setValue(event.target.value);
  }

  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [value, setValue] = useState([]);
  const [color, setColor] = useState("rgba(255, 0, 0, 0.9")
  
  /* Outils d'affichage de la modale */
  const [revele, setRevele] = useState(false);
  const toggleModal = () => {setRevele(!revele);}
  /*------*/
  const [reveleAdd, setReveleAdd] = useState(false);
  const toggleAdd = () => {setReveleAdd(!reveleAdd);}


  /*get friendlist*/    
  useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    setFriends(res.data);
    });

    //-* Get all users
    axios.get("http://localhost:3000/users/all", {withCredentials:true}).then((res) =>{
    setAllUsers(res.data);
    });

    socket.on("changeColor", data => {
      axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
       setFriends(res.data);
       console.log('after socket on, ', res.data);
       });
    });
  }, [])


  const beginChat = (friend) => {
    console.log('beginchat',props.user);
    const roomname = friend.id < props.user.id ? friend.id + '.' + props.user.id : props.user.id + '.' + friend.id;
    socket.emit('addsalon', props.user.id, true, true, roomname, friend.login);
    //socket.emit('user_joins_room', {userId: props.user.id, room: roomname, otherLogin: friend.login});

  };


/* Recherche d'amis a ajouter */
    return(
        <div>
          <MaterialIcon icon="person add" onClick={toggleAdd} />
          <div style={lists}>
            {friends.map(friends => (
            <p><svg width="48" height="40" viewBox='0 0 45 40'>
              <foreignObject x="0" y="0" width="45" height="40" >
                <div><img style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="friend-avatar" src={friends.avatar}/></div>
              </foreignObject>
            <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={friends.color}></rect></svg>
            {friends.login} | <MaterialIcon icon="chat" onClick={() => {beginChat(friends)}} /> | Spectate | Defeat |<br></br></p>
            ))}   
          </div>
          <ModalWindow revele={reveleAdd} setRevele={toggleAdd}>
            <p>Add new friends</p>
            <div className="search bar">
              <input type = "text" value={value} onChange={onChange} />
              {/*When we click on button it opens the FriendUserProfil*/}
              <button onClick={toggleModal}> Find your friends </button>
              <ModalWindow revele={revele} setRevele={toggleModal}>
                <FriendUserProfilExtended Value={value}/>
              </ModalWindow>
            </div>

            <div style={lists}>
              {allUsers.map(users => (
                <div>
                  <DisplayUser userConnected={props.user} userSelected={users} />
                  {/*<p><svg width="48" height="40" viewBox='0 0 45 40'>
                  <foreignObject x="0" y="0" width="45" height="40" >
                    <div><img style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="user-avatar" src={users.avatar}/></div>
                  </foreignObject>
                  <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={users.color}></rect></svg>
                
                  {users.login} | <MaterialIcon icon="person add" onClick={toggleProfil} /> | <MaterialIcon icon="chat" onClick={() => {beginChat(users)}} /> | Spectate | Defeat |<br></br></p>
                  <ModalWindow revele={reveleProfil} setRevele={toggleProfil}>
                    <FriendUserProfilExtended Value={users.login}/>
                  </ModalWindow>*/}
                </div>
              ))}   
            </div>

          </ModalWindow>
        </div>
    );
 };

 export default AddFriend;
 
  