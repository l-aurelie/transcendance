/* sam */
import React, { useState } from 'react';
import Logo from '../Logo';
import CreateSalon from '../AddChannel';
import AddNav from '../AddNav';
import Select from 'react-select';
const log = {
    position : 'relative',
    top : '5%',
   // left: '50%'
}
const bar = {
    position : 'relative',
    top : '20%'
}
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


const options = [{value:'choco', label: 'cchh'},
                    {value: 'strwbe', label:'straw'},
                { value:'valinna', label:'vanilla'}]

/* Affiche la modale d'ajout de Friend/Channels */
const WatchModale = ({user, revele, toggle, game}) => revele ? (
    
    
    <React.Fragment>
        <div style={background} />
        <div style={modale}>
            {/* Composants contenus dans la fenetre */}
            <div style={log}>
            <Logo  />
            </div>
            <div style={bar} >
           <Select  options={game}/>
           </div>
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default WatchModale;