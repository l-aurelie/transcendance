import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {socket} from './Socket';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import FriendUserProfilExtended from './FriendUserProfileExtended';

const lists = {
  // overflowY: 'scroll'
  overflowY: "scroll" as "scroll"
}

const AddFriend = (props) => {
const onChange = (event) => {
    setValue(event.target.value);
  }

  const [friends, setFriends] = useState([]);
  const [value, setValue] = useState([]);
  /* Outils d'affichage de la modale */
  const [revele, setRevele] = useState(false);
  const toggleModal = () => {setRevele(!revele);} 
  /*------*/
  
  /*get friendlist*/    
  useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
      setFriends(res.data);
    })
  }, [])

  const beginChat = (friend) => {
    console.log('beginchat',props.user);
    const roomname = friend.id < props.user.id ? friend.id + '.' + props.user.id : props.user.id + '.' + friend.id;
    socket.emit('addsalon', props.user.id, true, true, roomname);
    socket.emit('user_joins_room', {userId: props.user.id, room: roomname, otherLogin: friend.login});

  };


/* Recherche d'amis a ajouter */
    return(
        <div>
          <div style={lists}>
            {friends.map(friends => (
            <p><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} alt="friend-avatar" src={friends.avatar}/> {friends.login} | <button onClick={() => {beginChat(friends)}}>L</button>Spectate | Defeat |<br></br></p>
            ))}   
          </div>
          <p>Search for friends</p>
          <div className="search bar">
            <input type = "text" value={value} onChange={onChange} />
            {/*When we click on button it opens the FriendUserProfil*/}
            <button onClick={toggleModal}> Find your friends </button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
              <FriendUserProfilExtended Value={value}/>
            </ModalWindow>
          </div> 
        </div>
    );
 };

 export default AddFriend;
 
  