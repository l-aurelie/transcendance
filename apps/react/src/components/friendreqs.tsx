/*LAURA: friend requests component qui ouvre la fenetre FriendReqsModale quand on clicke sur le button "friend requests" */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AcceptButton from './AcceptButton';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import RejectButton from './RejectButton';
import { socket } from './Socket';

const FriendReqss = ({reqnotif}) => {

    const [reqs, setreqs] = useState([]);
    const [refresh, setRefresh] = useState(false);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/

    useEffect(() => {
        setRefresh(false);
        console.log('in friend request');
        axios.get("http://localhost:3000/friends/friendRequest/me/received-requests", {withCredentials:true}).then((res) =>{
            setreqs(res.data);
        })

        socket.on("changeReqs", data => {
            axios.get("http://localhost:3000/friends/friendRequest/me/received-requests", {withCredentials:true}).then((res) =>{
             setreqs(res.data);
             console.log('A REQUEST SENT, ', res.data);
             });
          })

    },[refresh]);

    return(
        <div>
        {
            reqnotif ?
            <button onClick={toggleModal} style={{backgroundColor:'pink'}}>Friend Reqs</button>
            :
            <button onClick={toggleModal}>Friend Reqs</button>
        }
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <h1>Friend Requests</h1>
                {reqs.map(reqs => (
                    <div key={reqs.id}><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt="avatar" src={reqs.sender.avatar}/><br></br> 
                    {reqs.status} request from {reqs.sender.login}
                    <AcceptButton FriendReq = {reqs} setRefresh={setRefresh}></AcceptButton>
                    <RejectButton FriendReq = {reqs} setRefresh={setRefresh}></RejectButton></div>
                ))}
            </ModalWindow>
        </div>
        );
}
export default FriendReqss