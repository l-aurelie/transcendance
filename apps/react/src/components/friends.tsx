/*LAURA: friendlist, il appelle le modale Friendsmodale qui va afficher les amis d'utilisateur*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/Friendsmodale';

const Friends = () => {
   // const {revele, toggle} = LogiqueModale();
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
         <button onClick={toggle}>Friends</button>
         <Modale revele={revele} toggle={toggle} friends={friends} />
        </div>
        );
}
export default Friends