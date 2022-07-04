/* laura */
import CSS from 'csstype';
import React, { useState } from 'react';

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
const Modale = ({revele, toggle, history}) => revele ? (
    <React.Fragment>
        <div style={background} />
        <div style={modale}>
            {/* Composants contenus dans la fenetre: src to become friend.avatar */}
            <h1>Match history</h1>
            {history.map(history => (
            <p>{history}</p>
            ))}
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default Modale;