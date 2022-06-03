/* aurelie */

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserProfil = () => {

  //const[isLoading, setLoading] = useState(true);
 
  
    const [profil, setProfil] = useState([]);
   
    useEffect(() => {
      axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
     console.log("heeey");
     console.log(res.data);
     console.log('hoooo');
      setProfil(res.data);
    //  setLoading(false)
    })
  }, [])
  
    
    //if(isLoading) {
    //  return <div>wait for charging...</div>;
   // }
    return(
      <div>
        <h1>Profile Page</h1>
       
   <div>{profil.login}</div>
     
      </div>
    );
  }
  // <div>{profil.login}</div>
 // <div>{profil.email}</div>
 // <img src={profil.avatar} />
  export default UserProfil