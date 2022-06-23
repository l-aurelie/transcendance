/* aurel john*/
import React from 'react';
import Logo from '../Logo';
import SideBarChatNav from '../SideBarChatNav';


const modale = {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
    width: '250px',
    zIndex: '9999'
  }

const button = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

/* Fait apparaitre la sideBarChat */
const SideBarChatModale = ({revele, toggle, user}) => revele ? (
    <React.Fragment>
        <div style={modale}>
            {/* Composants contenus dans la fenetre */}
            <SideBarChatNav user={user}/>  
            {/* Bouton pour fermer la fenetre */}
            <button style={button} type='button' onClick={toggle}>x</button>
        </div>
    </React.Fragment>
 ) : null;



export default SideBarChatModale;