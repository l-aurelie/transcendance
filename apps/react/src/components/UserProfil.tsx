/*aurelie john*/

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import UserProfilExtended from './UserProfilExtended';
import { socket } from "./Socket";
import MaterialIcon from 'material-icons-react';
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
    const [friendNotif, setFriendNotif] = useState(0);

    console.log('revele2 =', revele2, user, props.dataFromParent)
      const toggleModal2 = () => {setRevele2(!revele2)};
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {
      setRevele(!revele);
      
        console.log('in user profil user demand');
        axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
            setUser(res.data);
        })
        .catch(error => {
          if (error.response && error.response.status)
          {
              if (error.response.status === 403)
                  window.location.href = "http://localhost:4200/";
              else
                  console.log("Error: ", error.response.code, " : ", error.response.message);
          }
          else if (error.message)
              console.log(error.message);
          else
              console.log("unknown error");
      })
      ;}
      const toggleModalBis = () => {
        setRevele(!revele);
        ;} 
    /*------*/
    useEffect(() => {
      axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
            setUser(res.data);
            setRevele2(res.data.first);
        })
        .catch(error => {
          if (error.response && error.response.status)
          {
              if (error.response.status === 403)
                  window.location.href = "http://localhost:4200/";
              else
                  console.log("Error: ", error.response.code, " : ", error.response.message);
          }
          else if (error.message)
              console.log(error.message);
          else
              console.log("unknown error");
      })
      socket.on("changeInfos", data => {
        axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
        setUser(res.data);
        })
        .catch(error => {
          if (error.response && error.response.status)
          {
              if (error.response.status === 403)
                  window.location.href = "http://localhost:4200/";
              else
                  console.log("Error: ", error.response.code, " : ", error.response.message);
          }
          else if (error.message)
              console.log(error.message);
          else
              console.log("unknown error");
      })
     });
    },[]);

    useEffect(() => {
            axios.get("http://localhost:3000/friends/friendRequest/me/received-requests", {withCredentials:true}).then((res) =>{
            console.log(res.data, res.data.length);
            setFriendNotif(res.data.length);
        })
        .catch(error => {
          if (error.response && error.response.status)
          {
              if (error.response.status === 403)
                  window.location.href = "http://localhost:4200/";
              else
                  console.log("Error: ", error.response.code, " : ", error.response.message);
          }
          else if (error.message)
              console.log(error.message);
          else
              console.log("unknown error");
      })
     }, []);

    useEffect(() => {
      socket.on("newfriendrequest", isNewNotif => {
        console.log('inn', isNewNotif);
          if (isNewNotif)
            setFriendNotif(prevCount => ++prevCount);
          else
            setFriendNotif(prevCount => --prevCount);
       });
    },[])

    useEffect(() => {
      console.log('new friend notif !! ', friendNotif);
    },[friendNotif])

  // fonction trigger lorsque l'on clique sur le bouton, qui va lgout l'utilisateur s'il est connecte ou le login s'il ne l'est pas
  const handleClick = event => {
    if (connected) {
      axios.get("http://localhost:3000/auth/logout", { withCredentials:true })
      socket.emit('logout', {userId:user.id});
      setConnected(false);
      setUser(0);
    }
    else {
      setConnected(true);
      window.location.href="http://localhost:3000/auth/login";
    }
  };

  // return conditionnel selon l'etat de connection de l'utilisateur
  if (connected && user !== 0) {
    return(
   // <h2>{props.dataFromParent}</h2>
      <div>
        <FirstConnect revele={revele2} toggle={toggleModal2} user={user}></FirstConnect>

        {/* Bonton pour display profilExtended */}
        {
        friendNotif ?
          <svg width="45" height="45" viewBox='0 0 45 45'>
          <foreignObject x="0" y="0" width="45" height="45">
            <div><img onClick={toggleModal} style={{maxWidth: "45px", maxHeight: "45px", borderRadius: '100%' }} alt="user-avatar" src={user.avatar}/></div>
          </foreignObject>
          <g>
          <rect width="11" height="11" x="34" y="34" rx="5" ry="5" fill='pink'></rect>
          {/*<text x="38" y="43" font-family="Verdana" font-size="8" fill="black">{friendNotif}</text>*/}
          </g></svg>
          :
          <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} onClick={toggleModal} src={user.avatar} alt="description yes"/>
        }
        <ModalWindow revele={revele} setRevele={toggleModal}>
          <UserProfilExtended user={user} reqnotif={friendNotif} toggleProfil={toggleModal} toggleProfil2={toggleModalBis}/><br></br>
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