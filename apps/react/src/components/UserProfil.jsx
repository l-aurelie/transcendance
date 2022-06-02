/* aurelie */

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {
   // const name;
    const [profil, setProfil] = useState([]);/* la variable profil qui contiendra les infos du profil et son setter */
    /* Ce useEffect sera executee a chaque fois que le composant est monte, il effectue une requete sur nest pour obtenir le profil de lutilisateur*/ 
    useEffect(() => {
      axios.get("http://localhost:3000/auth/login", {withCredentials: true}).then((res) =>{ //axios permet ici de faire une requete get vers un controller de nest (voir nest/src/user/user.controller.ts), il retourne pour l' instant le login de l'utilisateur portant l'id '1', plus tard cela sera change pour obtenir les informations de l'utilisateur connecte
     console.log(res.data);
      setProfil(res.data);//response de la requete place dans la variable profil 
      })
    }, [])
    /* Affiche les infos du profil */
    return(
      <div>
        <h1>Profile Page</h1>
        <div>{profil.login}</div>
     
      </div>
    );
  }
 // <div>{profil.email}</div>
 // <img src={profil.avatar} />
  export default UserProfil