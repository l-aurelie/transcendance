/* aurelie John */
// import axios from "axios";
// import React, {Component} from 'react';
import { useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
// import LogiqueModale from "./ModaleWindow/logiqueModale";
import MySalons from "./MySalons";
import { markAsUntransferable } from "worker_threads";
import { defaultIfEmpty } from "rxjs";

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
  paddingRight: '90px',
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

const defeat = (id) => {
  setShow(false);

  socket.emit('defeat', actualUser, id)
}
  const handleLeave = () => {
    setShow(false);
  }
  //handle l'evenement changement de salon quand l'utilisateur clique pour changer de salon
  //ferme connection sur le channel de l'ancier salon, le setCurrentSalon trigger le useEffect qui va faire ecouter l'utilisateur sur le nouveau salon
// useEffect(() => {
//   document.addEventListener("click", handleClick);
// })
const actionUser = (event, data) => {
  setAnchorPoint({x:event.pageX, y: event.pageY});
  setShow(true);
 // setMessage(message.sort((a, b) => (a.id > b.id) ? 1 : -1));

}
const actionMenu = (event, data) => {
  //setAnchorPoint({x:event.pageX, y: event.pageY});
  setShow(true);
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
      
    <div style={messageStyle}>

    <div><p style={chatTitle}>{currentSalon.display}</p></div>
        <div style={chatBox} >
      

        {/* Affichage de la variable message detenant tout l'historique des messages*/}
        {message.map((data) => (
        <div style={messageSent} key={data.id}>
          {show ? (<div onMouseEnter={event => actionMenu(event, data)} className="menu" style={{
  fontSize: '14px',
backgroundColor:'#D6697F',
borderRadius:'2px',
padding: '5px 0 5px 0',
width : '100px',
height:'auto',
 position:'absolute' as 'absolute',
listStyle: 'none',
top:anchorPoint.y,
 left:anchorPoint.x-50
}}>

  <li style={overLi} onClick={() => defeat(data.sender)}>Defeat</li>
  <li style={overLi} >Profil</li>
</div>): null }
          <p ><b style={over} onClick={event => actionUser(event, data)} >{data.senderLog}</b> : {data.message}</p></div>
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