/* laura */
import axios from 'axios';
import React, { useState } from 'react';

/* Assombri l'arriere plan */
const background = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const modale = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}

const button = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

/* Ternaire, affiche modale si revele recu en parametre est true  */
const Modale = ({revele, toggle, friends}) => revele ? (
    <React.Fragment>
        <div style={background} />
        <div style={modale}>
            {/* Composants contenus dans la fenetre: src to become friend.avatar */}
            <h1>My friends</h1>
            {friends.map(friends => (
            <p><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={friends.avatar}/><br></br>{friends.login}</p>
            ))}
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default Modale;