/*aurelie john*/
//TODO: Mettre le bouton login dans son propre composant ?

import axios from 'axios';
import React, { useState } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/modale';
const UserProfil = (props) => {
    const user = props.dataFromParent;
    const {revele, toggle} = LogiqueModale(1);
    
    const [connected, setConnected] = useState([false]);

   
  
  // fonction trigger lorsque l'on clique sur le bouton, qui va lgout l'utilisateur s'il est connecte ou le login s'il ne l'est pas
  const handleClick = event => {
    if (connected) {
      axios.get("http://localhost:3000/auth/logout", { withCredentials:true })
      setConnected(false);
    }
    else {
      setConnected(true);
      window.location.href="http://localhost:3000/auth/login";
    }
  };

  

  // return conditionnel selon l'etat de connection de l'utilisateur
  if (connected) {
    return(
   // <h2>{props.dataFromParent}</h2>
      <div>
    {/* Bonton pour display profilExtended + avatar et login */}
    <button onClick={toggle}>
      <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={user.avatar} alt="description yes"/>
    </button>
    <Modale revele={revele} toggle={toggle} name={user.login} />
    
    <div>{user.login}</div>

    <button onClick={handleClick}>
          Logout
        </button>
      </div>
    ); }
  else {
    return(
      <div>
    <button onClick={handleClick}>
          Login
        </button>
      </div>
    ); }
  }
  export default UserProfil