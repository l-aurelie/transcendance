/*LAURA: friendlist, il appelle le modale Friendsmodale qui va afficher les amis d'utilisateur*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FriendUserProfilExtended from './FriendUserProfileExtended';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';

const hello = {
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'scroll',
} as React.CSSProperties;

const Friends = () => {
    const [friends, setFriends] = useState([]);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const [reveller, setReveller] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    const toggler = () => {setReveller(!reveller);} 
    /*------*/

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
                    <div>
                    <p><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt="avatar" src={friends.avatar}/><br></br></p>
                     <button onClick={toggler}>{friends.login}</button>
                     <ModalWindow revele={reveller} setRevele={toggler}>
                     <FriendUserProfilExtended Value={friends.login}/>
                     </ModalWindow>
                     </div>
                ))}
            </ModalWindow>
        </div>
        );
}
export default Friends