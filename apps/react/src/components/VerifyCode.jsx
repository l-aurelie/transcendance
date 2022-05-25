/*samantha*/
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VerifyCode = () => {
    const [profil, setProfil] = useState([]);
    /* Ce useEffect sera executee a chaque fois que le composant est monte, il effectue une requete sur nest */ 
    useEffect(() => {
      axios.post("http://localhost:3000/auth/verify").then((res) =>{
        setProfil(res.data);
      })
    }, [])
    return(
      <div>
        <h1>{profil}</h1>
      </div>
    );
  }

  export default VerifyCode