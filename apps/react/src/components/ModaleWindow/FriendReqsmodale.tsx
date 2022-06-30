/*LAURA: friend requests modal: Base sur le modale de Aurelie mais avec les detailles des requetes "pending" recues + un button accept/reject*/
import React, { useState } from 'react';
import CSS from 'csstype';
import AcceptButton from '../AcceptButton';
import RejectButton from '../RejectButton';

/* Assombri l'arriere plan */
const background: CSS.Properties = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const modale: CSS.Properties = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
}

const button: CSS.Properties = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

/* Ternaire, affiche modale si revele recu en parametre est true  */
const Modale = ({revele, toggle, reqs}) => revele ? (
    <React.Fragment>
        <div style={background}/>
        <div style={modale}>
            <h1>Friend Requests</h1>
            {reqs.map(reqs => (
            <p><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={reqs.sender.avatar}/><br></br> 
             {reqs.status} request from {reqs.sender.login}
            <AcceptButton FriendReq = {reqs}></AcceptButton>
            <RejectButton FriendReq = {reqs}></RejectButton></p>))}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default Modale;