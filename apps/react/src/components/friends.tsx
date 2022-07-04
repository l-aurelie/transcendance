/*LAURA: friendlist, il appelle le modale Friendsmodale qui va afficher les amis d'utilisateur*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';

const Friends = () => {
    const [friends, setFriends] = useState([]);
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
    return(
        <div>
            <button onClick={toggleModal}>Friends</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <h1>My friends</h1>
                {friends.map(friends => (
                    <p><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={friends.avatar}/><br></br>{friends.login}</p>
                ))}
            </ModalWindow>
        </div>
        );
}
export default Friends