/* sam */
import React from 'react';
import Logo from '../Logo';
import AddNav from '../AddNav';

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


/* Affiche la modale d'ajout de Friend/Channels */
const AddModale = ({user, revele, toggle}) => revele ? (
    
    <React.Fragment>
        <div style={background} />
        <div style={modale}>
            {/* Composants contenus dans la fenetre */}
            <Logo />
            {console.log('oh he', user)};
            <AddNav user={user}/>
           
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default AddModale;