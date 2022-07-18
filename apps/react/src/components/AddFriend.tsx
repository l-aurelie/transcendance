/* aurelie */
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
  //const [color, setColor] = useState("rgba(255, 0, 0, 0.9")
  
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



/* Recherche d'amis a ajouter */
    return(
        <div>
          <MaterialIcon size="large" icon="person_add" onClick={toggleAdd} />
          <div style={lists}>
            {friends.map(friends => (
              <div key={friends.id}><DisplayUser userConnected={props.user} userSelected={friends} isFriend={true} /></div>
            ))}   
          </div>
          <ModalWindow revele={reveleAdd} setRevele={toggleAdd}>
            <p>Add new friends</p>
            <div className="search bar">
              <input type = "text" value={value} onChange={onChange} />
              {/*When we click on button it opens the FriendUserProfil*/}
              <button onClick={toggleModal}> Find members </button>
              <ModalWindow revele={revele} setRevele={toggleModal}>
                <FriendUserProfilExtended Value={value}/>
              </ModalWindow>
            </div>

            <div style={lists}>            
            {allUsers.map(users => (
              <div key={users.id}>{
              friends.includes(users) === false && users.id != props.user.id  ? 
                  <DisplayUser userConnected={props.user} userSelected={users} isFriend={false} />
              : <></>}
              </div>
            ))}  
            {/* <div style={lists}>
              {allUsers.map(users => (
                  <div key={users.id}><DisplayUser userConnected={props.user} userSelected={users} isFriend={false} /></div>
              ))}    */}
            </div>

          </ModalWindow>
        </div>
    );
 };

 export default AddFriend;