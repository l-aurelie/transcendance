/*LAURA: friend requests component qui ouvre la fenetre FriendReqsModale quand on clicke sur le button "friend requests" */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AcceptButton from './AcceptButton';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import RejectButton from './RejectButton';

const FriendReqss = ({reqnotif}) => {

    const [reqs, setreqs] = useState([]);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/


    useEffect(() => {
        console.log('in friend request');
        axios.get("http://localhost:3000/friends/friendRequest/me/received-requests", {withCredentials:true}).then((res) =>{
            setreqs(res.data);
        })
    },[]);

    return(
        <div>
            <button onClick={toggleModal}>Friend Reqs</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <h1>Friend Requests</h1>
                {reqs.map(reqs => (
                    <div key={reqs.id}><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt="avatar" src={reqs.sender.avatar}/><br></br> 
                    {reqs.status} request from {reqs.sender.login}
                    <AcceptButton FriendReq = {reqs}></AcceptButton>
                    <RejectButton FriendReq = {reqs}></RejectButton></div>
                ))}
            </ModalWindow>
        </div>
        );
}
export default FriendReqss