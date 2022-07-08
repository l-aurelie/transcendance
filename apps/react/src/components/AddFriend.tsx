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
  const [color, setColor] = useState("rgba(255, 0, 0, 0.9")
  /*------*/
  
  /*get friendlist*/    
  useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    setFriends(res.data);
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
    socket.emit('addsalon', props.user.id, true, true, roomname);
    socket.emit('user_joins_room', {userId: props.user.id, room: roomname, otherLogin: friend.login});

  };


/* Recherche d'amis a ajouter */
    return(
        <div>
          <div style={lists}>
            {friends.map(friends => (
            <p><svg width="48" height="40" viewBox='0 0 45 40'>
              <foreignObject x="0" y="0" width="45" height="40" >
                <div><img style={{maxWidth: "40px", maxHeight: "40px", borderRadius: '100%' }} alt="friend-avatar" src={friends.avatar}/></div>
              </foreignObject>
            <rect width="11" height="11" x="30" y="29" rx="5" ry="5" fill={friends.color}></rect></svg>
            {friends.login} | <button onClick={() => {beginChat(friends)}}>L</button>Spectate | Defeat |<br></br></p>
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
 
  