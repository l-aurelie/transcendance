/* ce composant sera rappele partout */
/* permet de creer des liens vers des urls*/

import React from 'react';
import { NavLink } from 'react-router-dom';
// import About from '../pages/About';

const Navigation = () => {
    return (
        <div className='navigation'>
            <ul>
                <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Accueil</li>
                </NavLink>
                <NavLink to="About" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>A propos</li>                    
                </NavLink>
                <NavLink to="*" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Error</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation;