/*aurelie john*/

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Login from "../pages/Login";

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
  if (connected) {
    return(
      <div>
        <h1>Profile Page</h1>
    <button onClick={handleClick}>
          Logout
        </button>
    <div>{profil.login}</div>

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