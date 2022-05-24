import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {
    const [profil, setProfil] = useState([]);
    /* Ce useEffect sera executee a chaque fois que le composant est monte, il effectue une requete sur nest */ 
    useEffect(() => {
      axios.get("http://localhost:3000/user").then((res) =>{
        setProfil(res.data);
      })
    }, [])
    return(
      <div>
        <h1>{profil}</h1>
      </div>
    );
  }

  export default UserProfil