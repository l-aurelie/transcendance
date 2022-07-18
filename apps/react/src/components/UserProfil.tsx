/*aurelie john*/

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import UserProfilExtended from './UserProfilExtended';
import { socket } from "./Socket";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import FirstConnect from './FirstConnect';

const UserProfil = (props) => {
    //const actual = props.dataFromParent;
    //const [user, setUser] = useState(props.dataFromParent);
    //const [user, setUser] = useState();
    //setUser(props.dataFromParent);
    //let user = props.dataFromParent;
    const [user, setUser] = useState(props.dataFromParent);
    const [connected, setConnected] = useState([false] as any);

    /* Outils d'affichage de la modale */
    const [revele2, setRevele2] = useState(false);
    console.log('revele2 =', revele2, user, props.dataFromParent)
      const toggleModal2 = () => {setRevele2(!revele2)};
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);
      
        console.log('in user profil user demand');
        axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
            setUser(res.data);
        })
      ;} 
    /*------*/
    useEffect(() => {
      axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
            setUser(res.data);
            setRevele2(res.data.first);
        });
      socket.on("changeInfos", data => {
        axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
        setUser(res.data);
        });
     });
    },[]);

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
        <FirstConnect revele={revele2} toggle={toggleModal2} user={user}></FirstConnect>

        {/* Bonton pour display profilExtended */}
        <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} onClick={toggleModal} src={user.avatar} alt="description yes"/>
        <ModalWindow revele={revele} setRevele={toggleModal}>
          <UserProfilExtended user={user} /><br></br>
        </ModalWindow>
        <div>{user.login}</div>
        <MaterialIcon icon="power_settings_new" onClick={handleClick} /> 
      </div>
    ); }
  else {
    return(
      <div>
        <MaterialIcon icon="power_settings_new" onClick={handleClick} /> 
      </div>
    ); }
  }
  export default UserProfil