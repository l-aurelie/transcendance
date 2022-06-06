/*aurelie john*/

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {

  //const[isLoading, setLoading] = useState(true);
    const [profil, setProfil] = useState([]);
    const [connected, setConnected] = useState([false]);

    useEffect(() => {
      axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
     console.log(res.data);
      setProfil(res.data);
      setConnected(true);
    //  setLoading(false)
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

  //if(isLoading) {
  //  return <div>wait for charging...</div>;
  // }

  // return conditionnel selon l'etat de connection de l'utilisateur
  if (connected) {
    return(
      <div>
    <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={profil.avatar} />
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
  // <div>{profil.login}</div>
  // <div>{profil.email}</div>
  // <img src={profil.avatar} />
  export default UserProfil