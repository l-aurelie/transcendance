/* aurelie John */
// import axios from "axios";
// import React, {Component} from 'react';
import { useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
// import LogiqueModale from "./ModaleWindow/logiqueModale";
import MySalons from "./MySalons";
import { markAsUntransferable } from "worker_threads";
import { defaultIfEmpty } from "rxjs";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MatchHistory from "./MatchHistory";
import FriendUserProfilExtended from './FriendUserProfileExtended';
import Defeat from './Defeat';
/* Style (insere dans la div jsx) */

const chatStyle = {
  display: 'flex'
}

const mySalonStyle = {
  display: 'flex',
  backgroundColor: 'yellow',
  flexDirection: 'column' as 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '60px',
  height: '700px',
}

const messageStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '250px',

}
const chatBox = {
  marginTop: 'auto',
  overflowY: 'scroll' as 'scroll',
  border: '2px',
}

const scrollBox = {
  overflowY: 'scroll' as 'scroll',
}
const chatTitle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "auto", 
  outline: "ridge", "1px": "red",
  //width: "250px",
 // height: "80px",
  borderRadius: "2rem",
}
const messageSent = {
  textAlign: 'right' as 'right',
}
const salonName = {
  marginTop: "auto", 

}
const notifSalon = {
  marginTop: "auto", 
  backgroundColor: 'pink',
}
const over = {
  cursor: 'pointer',
}
const overLi = {
  cursor: 'pointer',
  padding: '0',
  textAlign: 'left' as 'left',
}
const menu = {
  fontSize: '14px',
  backgroundColor:'#fff',
  borderRadius:'2px',
  padding: '5px 0 5px 0',
  width : '150px',
  height:'auto',
  margin:'0',
  position:'absolute' as 'absolute',
  listStyle: 'none',
  boxShadow: '0 0 20px 0 #ccc',
  opacity:'1',
  transition: 'opacity 0.5s linear',
}

const Chat = (props) => {

  const actualUser = props.dataFromParent;

  const [message, setMessage] = useState([]);// Message a envoyer au salon
  const [string, setString] = useState([]);// Message a envoyer au salon
  const [currentSalon, setCurrentSalon] = useState([] as any);// Salon courant
  const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
  const [anchorPoint, setAnchorPoint] = useState({x:0, y:0});
  const [show, setShow] = useState(false);
  const [revele, setRevele] = useState(false);
  const [revele2, setRevele2] = useState(false);
  const toggleModal = () => {setRevele(!revele);}
  const toggleModal2 = () => {setRevele2(!revele2);}
  const [userIdClick, setUserIdClick] = useState(0);
  const [userLogClick, setUserLogClick] = useState('');
  const [defeatUser, setDefeatUser] = useState();
  const [version, setVersion] = useState(0);
  const [same, setSame] = useState(false);
  
  //Emit le message rentre par l'utilisateur a tout le salon
  const sendMessage = (event) => {
    if(event.key === 'Enter') {
      console.log(currentSalon);
      if (currentSalon.length !== 0)
        socket.emit('chat', {roomToEmit: currentSalon.name, message : event.target.value, whoAmI: actualUser, isDm: currentSalon.isDm});
      event.target.value = "";
      console.log(joinedSalons);
    }
  }

 
  useEffect(() => {
    socket.on("noMoreMatch", data => {
      setRevele(false);
    });
      socket.on("ask-defeat", data => {
      setDefeatUser(data.user);
        setVersion(data.version);
        console.log('ask def version=', data.version);
        toggleModal();
        console.log(data.user.login, "ask to defeat you, ", actualUser.login);
    });
},[actualUser])
const getUserProfil = () => {
  toggleModal2();
  closeMenu();
}

const defeat = (smash) => {
  setShow(false);
  socket.emit('defeat', actualUser, userIdClick, smash);
  closeMenu();
  console.log('smash=', smash);
}
  // const handleClick = (event) => {
  //   console.log('ev tar x',event.pageX);
  //   console.log('ev tar y',event.pageY);
  //   console.log('anch x',anchorPoint.x);
  //   console.log('anch y',anchorPoint.y);
  //   if (event.pageX === anchorPoint.x
  //     && event.pageY == anchorPoint.y)
  //     return ;
  //   setShow(false);
  // }
  //handle l'evenement changement de salon quand l'utilisateur clique pour changer de salon
  //ferme connection sur le channel de l'ancier salon, le setCurrentSalon trigger le useEffect qui va faire ecouter l'utilisateur sur le nouveau salon
//  useEffect(() => {
//    document.addEventListener("click", handleClick);
//  })
const actionUser = (event, data) => {

  setUserIdClick(data.sender);
  setUserLogClick(data.senderLog);
  setAnchorPoint({x:event.pageX, y: event.pageY});
  if (data.sender === actualUser.id)
    setSame(true);
  else
    setSame(false);
  setShow(true);
 // setMessage(message.sort((a, b) => (a.id > b.id) ? 1 : -1));

}
const closeMenu = () => {
  setShow(false);
}
const actionMenu = (event, data) => {
  //setAnchorPoint({x:event.pageX, y: event.pageY});
  setShow(true);
 // console.log(data.sender);
 // setMessage(message.sort((a, b) => (a.id > b.id) ? 1 : -1));

}
    const handleCallback = (childData) =>{
      setMessage(childData.msg);
      console.log('childata.msg = ', childData.msg);
      setCurrentSalon(childData.curSal);
      console.log('sur sur', childData);
  }

  const messagsEndRef = useRef(null);
  const scrollToBottom = () => {
    messagsEndRef.current.scrollIntoView({behavior:"smooth"});
  }
  useEffect(scrollToBottom, [message]);
  return (
     
    <div style={chatStyle} >
      <div style={mySalonStyle}>
        <MySalons actualUser={actualUser} callBack={handleCallback}/>
      </div>
      <ModalWindow revele={revele} setRevele={toggleModal}>
        <Defeat toggle={toggleModal} opponent={defeatUser} actual={actualUser} version={version}></Defeat>
      </ModalWindow>
      <ModalWindow revele={revele2} setRevele={toggleModal2}>
        <FriendUserProfilExtended Value={userLogClick}/>
      </ModalWindow>
    <div style={messageStyle}>

    <div><p style={chatTitle}>{currentSalon.display}</p></div>
        <div style={chatBox} >
      

        {/* Affichage de la variable message detenant tout l'historique des messages*/}
        {message.map((data) => (
        <div style={messageSent} key={data.id}>
{show ? (<div onMouseEnter={event => actionMenu(event, data)} className="menu" style={{
  fontSize: '14px',
backgroundColor:'#D7677E',
borderRadius:'2px',
padding: '0',
width : '100px',
height:'auto',
 position:'absolute' as 'absolute',
listStyle: 'none',
top:anchorPoint.y+5,
 left:anchorPoint.x-90
}}>
<b style={{textAlign:'center', cursor:'pointer'}} onClick={closeMenu}>▲</b>
  <p style={overLi} onClick={getUserProfil}>Profil</p>
  { same ?  <></> : (<div><p style={overLi} onClick={() => defeat(0)}>Defeat pong</p>
  <p style={overLi} onClick={() => defeat(1)}>Defeat smash</p></div>) }
  
</div>): null }
<p > { show ? <b style={over} onClick={closeMenu} >{data.senderLog}</b>: <b style={over} onClick={event => actionUser(event, data)} >{data.senderLog}</b>} : {data.message}</p>
        </div>
      ))}
      <div ref={messagsEndRef}></div>
        {/* Barre d'input pour ajouter un message */}
        </div>
        <input type='text' onKeyPress={sendMessage} />
      
      
   </div>
   </div>
  );
}
//<p  onClick={() => actionUser(data)}>
export default Chat
// {show ? (<div onMouseEnter={event => actionMenu(event, data)} className="menu" style={{
//   fontSize: '14px',
// backgroundColor:'#D6697F',
// borderRadius:'2px',
// padding: '0',
// width : '100px',
// height:'auto',
//  position:'absolute' as 'absolute',
// listStyle: 'none',
// top:anchorPoint.y,
//  left:anchorPoint.x-50
// }}>

//   <p style={overLi} onClick={() => defeat(data.sender)}>{actualUser.id} {data.sender} Defeat pong</p>
//   <p style={overLi} onClick={() => defeat(data.sender)}>Defeat smash</p>
//   <p style={overLi} >Profil</p>
// </div>): null }

// {show ? (<ul onMouseOut={handleLeave} onMouseEnter={event => actionMenu(event, sender)} className="menu" style={{
//   fontSize: '14px',
// backgroundColor:'#D6697F',
// borderRadius:'2px',
// padding: '5px 0 5px 0',
// width : '100px',
// height:'auto',
// margin:'0',
// position:'absolute' as 'absolute',
// listStyle: 'none',
// top:anchorPoint.y, left:anchorPoint.x}}>

// <li onMouseEnter={event => actionMenu(event, sender)} style={{marginTop: '5px',paddingRight: '90px'}}>Defeat</li>
// <li onMouseEnter={event => actionMenu(event, sender)} style={{marginTop: '5px',paddingRight: '90px'}} >Profil</li>
// </ul>): null }


// /* Recupere tout les utilisateur dans un tableau users, 1x slmt (componentDidMount) */
  // const [users, setUsers] = useState([]);// Tous les users de la db
  // const [userFound, setUserFound] = useState([]); // Contient l'utilisateur si trouve

  // useEffect(() => {
  //   axios.get("http://localhost:3000/users/all", { withCredentials: true }).then((res) => {
  //     setUsers(res.data);
  //     console.log('find all pour la barre de recherche:', users);
  //   });
  // }, [])
 
  // /* Apres enter dans la barre de recherche users */
  // const displayUser = (event) => {
  //   /* Recherche dans le tableau users sil trouve le user cherche */
  //  if(event.key === 'Enter'){
  //     console.log('===displayUSer()');
  //    const res = users.find(element => event.target.value === element.login);
  //    if (res)
  //      setUserFound(res);
  //    else
  //       setUserFound('User not found');
  //     /* Affiche le profil user */
  //     toggle();
  //   }
  // }
/* Barre de recherche d'un user + affichage de userFound
      <div>
        <p>Search a user</p>
        <input type='text' onKeyPress={displayUser} />
        <Modale revele={revele} toggle={toggle} name={userFound.login} />
      </div>*/