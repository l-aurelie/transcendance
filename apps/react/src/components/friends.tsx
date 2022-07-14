/*LAURA: friendlist, il appelle le modale Friendsmodale qui va afficher les amis d'utilisateur*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DisplayUser from './DisplayUser';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import { socket } from './Socket';
const hello = {
   // alignItems: 'center',
 //   justifyContent: 'center',
  //  overflowY: 'scroll',
} as React.CSSProperties;

const Friends = ({user}) => {
    const [friends, setFriends] = useState([]);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/
    socket.on("changeColor", data => {
        axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
         setFriends(res.data);
         console.log('after socket on, ', res.data);
         });
      });
    /*get friendlist*/
    useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
}, [])
    return(
        <div style ={hello}>
            <button onClick={toggleModal}>Friends</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <h1>My friends</h1>
                {friends.map(friends => (
                  <div key={friends.id}>
                    <DisplayUser userConnected={user} userSelected={friends} isFriend={true} />
                  </div>
                 
                ))}
            </ModalWindow>
        </div>
        );
}
export default Friends

        // <div>
        //   <p><svg width="112" height="100" viewBox='0 0 110 100'>
        //   <foreignObject x="0" y="0" width="110" height="100" >
        //     <div><img style={{maxWidth: "100px", maxHeight: "100px", borderRadius: '100%' }} alt="friend-avatar" src={friends.avatar}/></div>
        //   </foreignObject>
        //   <rect width="20" height="20" x="75" y="80" rx="10" ry="10" fill={friends.color}></rect></svg><br></br></p>*/}
        //   {/* <p><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={friends.avatar}/><br></br></p>*/}
        //   <button onClick={toggler}>{friends.login}</button>
        //   <ModalWindow revele={reveller} setRevele={toggler}>
        //     <FriendUserProfilExtended Value={friends.login}/>
        //   </ModalWindow>
        // </div>