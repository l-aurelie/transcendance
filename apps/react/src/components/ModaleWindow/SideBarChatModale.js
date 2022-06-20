/* aurel john*/
import React from 'react';
import Logo from '../Logo';

/* Assombri l'arriere plan */

const modale = {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
    width: '250px',
    zIndex: '9999'
  }
/*const modale = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}*/

const button = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

/* Ternaire, affiche modale si revele recu en parametre est true  */
const SideBarChatModale = ({revele, toggle}) => revele ? (
    <React.Fragment>
        <div style={modale}>
            {/* Composants contenus dans la fenetre */}
            <Logo />


            
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;



export default SideBarChatModale;