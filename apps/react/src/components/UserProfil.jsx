import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {
   // const name;
    const [profil, setProfil] = useState([]);
    /* Ce useEffect sera executee a chaque fois que le composant est monte, il effectue une requete sur nest */ 
    useEffect(() => {
      axios.get("http://localhost:3000/users").then((res) =>{ //axios permet ici de faire une requete get vers un controller de nest (voir nest/src/user/user.controller.ts), il retourne pour l' instant le login de l'utilisateur portant l'id '1', plus tard cela sera change pour obtenir les informations de l'utilisateur connecte
        setProfil(res.data);
       // name = res.data.name;
      })
    }, [])
    return(
      <div>
        <h1>{profil}</h1>
      {/* //  <h1>{name}</h1> */}
      </div>
    );
  }

  export default UserProfil