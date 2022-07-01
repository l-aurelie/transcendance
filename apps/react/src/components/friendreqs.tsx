/*LAURA: friend requests component qui ouvre la fenetre FriendReqsModale quand on clicke sur le button "friend requests" */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Modale from './ModaleWindow/FriendReqsmodale';
import LogiqueModale from './ModaleWindow/logiqueModale';

const FriendReqss = () => {

    const [reqs, setreqs] = useState([]);
    const {revele, toggle} = LogiqueModale();


useEffect(() => {
axios.get("http://localhost:3000/friends/friendRequest/me/received-requests", {withCredentials:true}).then((res) =>{
setreqs(res.data);
})
});

    return(
        <div>
         <button onClick={toggle}>Friend Reqs</button>
         <Modale revele={revele} toggle={toggle} reqs={reqs} />
        </div>
        );
}
export default FriendReqss