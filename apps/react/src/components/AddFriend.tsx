import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/FriendProfileModale';
import axios from 'axios';
import {socket} from './Socket';

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
  const {revele, toggle} = LogiqueModale();
  
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
            {/*When we click on button it opens the Modale described in FriendProfileModale.js*/}
            <button onClick={toggle}> Find your friends </button>
              <Modale revele={revele} toggle={toggle} Value={value}/>
        </div> 
        </div>
    );
 };

 export default AddFriend;
 
  