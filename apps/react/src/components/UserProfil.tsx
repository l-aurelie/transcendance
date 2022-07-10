/*aurelie john*/
//TODO: Mettre le bouton login dans son propre composant ?

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import UserForm from './UserForm';
import UserProfilExtended from './UserProfilExtended';
import UserFormAvatar from './UserFormAvatar';
import { socket } from "./Socket";

const UserProfil = (props) => {
    //const actual = props.dataFromParent;
    //const [user, setUser] = useState(props.dataFromParent);
    const user = props.dataFromParent;
    const [twofa, settwofa] = useState(false);
    const [connected, setConnected] = useState([false] as any);

    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);
      
        console.log('in user profil user demand');
        axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
            settwofa(res.data.twoFA)
            console.log('user demand',res.data.twoFA);
        })
      ;} 
    /*------*/

   


  // fonction trigger lorsque l'on clique sur le bouton, qui va lgout l'utilisateur s'il est connecte ou le login s'il ne l'est pas
  const handleClick = event => {
    if (connected) {
      axios.get("http://localhost:3000/auth/logout", { withCredentials:true })
      socket.emit('logout', {userId:user.id});
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
    <button onClick={toggleModal}>
      <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={user.avatar} alt="description yes"/>
    </button>

    {/* Ce qui est entre les deux modalWindow correspond a children recu en prop de la ft ModalWindow
    ** et sera affiche conditionnellement selon l'etat de revele */} 
    <ModalWindow revele={revele} setRevele={toggleModal}>
      <UserProfilExtended myuser={user}/><br></br>
    <div style={{display:'flex', justifyContent:'space-around'}}>
     <div style={{width:'50%', height:'auto', borderRight:'solid', borderColor:'grey'}}><h2>Change your informations</h2><UserForm user={user} twoFa={twofa}/></div>
     <div><h2>Change your photo</h2><UserFormAvatar user={user} /></div>
    </div>
    </ModalWindow>
    
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