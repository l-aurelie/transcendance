/* aurelie */

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {

  //const[isLoading, setLoading] = useState(true);
    const [profil, setProfil] = useState([]);
    
    useEffect(() => {
     axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{//TODO: withCredential veut dire quoi ?
    console.log(res.data);
     setProfil(res.data);
    //  setLoading(false)
   })
  }, [])
  
  //if(isLoading) {
  //  return <div>wait for charging...</div>;
  // }
  return(
    <div>
      <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={profil.avatar} />
      <div>{profil.login}</div>
    </div>
  );
  }
  // <div>{profil.login}</div>
  // <div>{profil.email}</div>
  // <img src={profil.avatar} />
  export default UserProfil