import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/Friendsmodale';

const Friends = () => {
    const {revele, toggle} = LogiqueModale();
    
    const [friends, setFriends] = useState([]);
    
    useEffect(() => {
    axios.get("http://localhost:3000/users/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
}, [])

    return(
        // <h2>{props.dataFromParent}</h2>
           <div>
         {/* Bonton pour display profilExtended + avatar et login */}
         <button onClick={toggle}>Friends</button>
         <Modale revele={revele} toggle={toggle} friends={friends} />
        </div>
        );
}
export default Friends