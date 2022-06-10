/*aurelie john*/
//TODO: Mettre le bouton login dans son propre composant ?

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/modale';
import {socket} from './Socket';
const UserProfil = () => {

    const [profil, setProfil] = useState([]);
    const {revele, toggle} = LogiqueModale();
    
    const [connected, setConnected] = useState([false]);

    useEffect(() => {
      axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
     console.log('in user profil: ', res.data);
      setProfil(res.data);
      setConnected(true);//TODO: pk true ici ? 
      socket.emit('whoAmI', res.data); 
    })
  }, [])
  
  // fonction trigger lorsque l'on clique sur le bouton, qui va lgout l'utilisateur s'il est connecte ou le login s'il ne l'est pas
  const handleClick = event => {
    if (connected) {
      axios.get("http://localhost:3000/auth/logout", { withCredentials:true })
      //window.location.href="http://localhost:3000/auth/login";
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
      <div>
    {/* Bonton pour display profilExtended + avatar et login */}
    <button onClick={toggle}>
      <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={profil.avatar} alt="description yes"/>
    </button>
    <Modale revele={revele} toggle={toggle} name={profil.login} />
    
    <div>{profil.login}</div>

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