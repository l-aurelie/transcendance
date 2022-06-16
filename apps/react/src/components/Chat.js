/* aurelie */
import axios from "axios";
import React, {Component} from 'react';
import { useEffect, useState } from "react";
import { socket } from "./Socket";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import Modale from "./ModaleWindow/modale";

import SalonModale from "./ModaleWindow/salonModale";

/* Style (insere dans la div jsx) */
const chatStyle = {
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
  const [users, setUsers] = useState([]);// Tous les users de la db
  const [userFound, setUserFound] = useState([]); // Contient l'utilisateur si trouve
  const {revele, toggle} = LogiqueModale();// Outils affichage users apres recherche
  
  const [message, setMessage] = useState([]);// Message a envoyer au salon
  const [currentSalon, setCurrentSalon] = useState([]);// Salon courant
  const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner

  /* Recupere tout les utilisateur dans un tableau users, 1x slmt (componentDidMount) */
  useEffect(() => {
    axios.get("http://localhost:3000/users/all", { withCredentials: true }).then((res) => {
      setUsers(res.data);
      console.log('find all pour la barre de recherche:', users);
    });
  }, [])
 
  /* Apres enter dans la barre de recherche users */
  const displayUser = (event) => {
    /* Recherche dans le tableau users sil trouve le user cherche */
   if(event.key === 'Enter'){
      console.log('===displayUSer()');
     const res = users.find(element => event.target.value === element.login);
     if (res)
       setUserFound(res);
     else
        setUserFound('User not found');
      /* Affiche le profil user */
      toggle();
    }
  }
 
  //Ecoute chat pour afficher tout nouveaux messages
  useEffect(() => {
    console.log(currentSalon);
    socket.on("chat", data => {
        setMessage((message) => {
          console.log('origin vs currentSalon', data.p1, currentSalon)
          if (data.p1 === currentSalon)
            return ([...message, data.p2]);
          else {
            joinedSalons.set(data.p1, true);
            setJoinedSalons(map => new Map(map.set(data.p1, true)));
            return (message);
          }
      //});
     });
      });
    }, [currentSalon])

    //Ecoute sur le channel newsalon pour ajouter les salons lorsqu'un utilisateur en cree
    useEffect(() => {
      socket.on('joinedsalon', data => {
          console.log('iciii', data);
          joinedSalons.set(data, false);
          socket.off('chat');
          setCurrentSalon(data);
       });
      }, [])
  
  //Emit le message rentre par l'utilisateur a tout le salon
  const sendMessage = (event) => {
    if(event.key === 'Enter') {
      console.log(currentSalon);

      socket.emit('chat', {p1: currentSalon, p2: event.target.value});
      event.target.value = "";
      console.log(joinedSalons);
    }
  }


  //handle l'evenement changement de salon quand l'utilisateur clique pour changer de salon
  //ferme connection sur le channel de l'ancier salon, le setCurrentSalon trigger le useEffect qui va faire ecouter l'utilisateur sur le nouveau salon
  const handleClick = (salon) => {
    console.log(salon);
      if (salon !== currentSalon) {
        console.log(salon, currentSalon);
        setJoinedSalons(map => new Map(map.set(salon, false)));
        console.log(joinedSalons);

        socket.off('chat');
        setCurrentSalon(salon);
      }
    };


  return (
    <div style={chatStyle}>
      {/* Barre de recherche d'un user + affichage de userFound */}
      <div>
        <p>Search a user</p>
        <input type='text' onKeyPress={displayUser} />
        <Modale revele={revele} toggle={toggle} name={userFound.login} />
      </div>
      {/* Barre d'input pour ajouter un salon */}  
      <div>
        <button onClick={toggle}>
          <p style={chatTitle}>Salons</p>
        </button> 
        <SalonModale revele={revele} toggle={toggle} user={actualUser}/>
      </div>
      {/* Affichage de l'array Salons par iteration */}
      {Array.from(joinedSalons.entries()).map((salon) => ( 
      <button onClick={() => handleClick(salon)}>

        {
          salon[1] ?
           <div style={notifSalon}>
            {salon[0]}
           </div>
         :
            <div style={salonName}>
             {salon[0]}
            </div>
       }
        </button>))}
       
        <div style={chatBox} ><p style={chatTitle}>{currentSalon}</p>

        {/* Affichage de la variable message detenant tout l'historique des messages*/}
      {message.map((msg) => (
        <div style={messageSent}>{msg}</div>
      ))}
        {/* Barre d'input pour ajouter un message */}
        <input type='text' onKeyPress={sendMessage} />
      
      </div>
   </div>
  );
}

export default Chat