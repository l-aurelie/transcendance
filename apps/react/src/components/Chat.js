/* aurelie John */
import axios from "axios";
import React, {Component} from 'react';
import { useEffect, useState } from "react";
import { socket } from "./Socket";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import MySalons from "./MySalons";

/* Style (insere dans la div jsx) */

const chatStyle = {
  display: 'flex'
}

const mySalonStyle = {
  display: 'flex',
  backgroundColor: 'yellow',
  flexDirection: 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '60px',
  height: '700px'
}

const messageStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '250px',
}
const chatBox = {
  marginTop: 'auto',
  border: '2px",'
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
  textAlign: 'right',
}
const salonName = {
  marginTop: "auto", 

}
const notifSalon = {
  marginTop: "auto", 
  backgroundColor: 'pink',
}


const Chat = (props) => {

  const actualUser = props.dataFromParent;

  const [message, setMessage] = useState([]);// Message a envoyer au salon
  const [string, setString] = useState([]);// Message a envoyer au salon
  const [currentSalon, setCurrentSalon] = useState([]);// Salon courant
  const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
   
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


  //handle l'evenement changement de salon quand l'utilisateur clique pour changer de salon
  //ferme connection sur le channel de l'ancier salon, le setCurrentSalon trigger le useEffect qui va faire ecouter l'utilisateur sur le nouveau salon


    const handleCallback = (childData) =>{
      setMessage(childData.msg);
      setCurrentSalon(childData.curSal);
      console.log('sur sur', childData);
  }

  return (
     
    <div style={chatStyle} >
      <div style={mySalonStyle}>
        <MySalons actualUser={actualUser} callBack={handleCallback}/>
      </div>
      <div style={messageStyle}>
        <div style={chatBox}><p style={chatTitle}>{currentSalon.display}</p>
          {/* Affichage de la variable message detenant tout l'historique des messages*/}
          {message.map((msg) => (
          <div style={messageSent}>{msg}</div>
          ))}
          {/* Barre d'input pour ajouter un message */}
          <input type='text' onKeyPress={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat





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
{/* Barre de recherche d'un user + affichage de userFound
      <div>
        <p>Search a user</p>
        <input type='text' onKeyPress={displayUser} />
        <Modale revele={revele} toggle={toggle} name={userFound.login} />
      </div>*/}