/* aurelie */
import axios from "axios";

import { useEffect, useState } from "react";
import { socket } from "./Socket";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import Modale from "./ModaleWindow/modale";

/* Style (insere dans la div jsx) */
const chatStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '250px',
}



const Chat = () => {

  const [users, setUsers] = useState([]);// Tous les users de la db
  const [userFound, setUserFound] = useState([]); // Contient l'utilisateur si trouve
  const {revele, toggle} = LogiqueModale();// Outils affichage users apres recherche
  
  const [message, setMessage] = useState([]);// Message a envoyer au salon
  const [currentSalon, setCurrentSalon] = useState(['chat']);// Salon courant
  const [salons, setSalons] = useState(['chat']); //Array de tous les salons a afficher, que l'on peut selectionner

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
 
  //Definit le salon que l'on ecoute, hooked sur currentSalon, pour reactualiser le salon d'ecoute a chqaue changement de salon
  //Ecoute le salon courant pour afficher tout nouveaux messages
  useEffect(() => {
    console.log(socket.id);
    socket.on(currentSalon, data => {
      console.log(currentSalon);
      setMessage((message) => {
        //data = {'\n'} + data;
        return ([...message, data]); });
     });
    }, [currentSalon])

    //Ecoute sur le channel newsalon pour ajouter les salons lorsqu'un utilisateur en cree
    useEffect(() => {
      socket.on('newsalon', data => {
        console.log(data);
        setSalons((salons) => {
          return ([...salons, data]); });
       });
      }, [])
  
  //Emit le message rentre par l'utilisateur a tout le salon
  const sendMessage = (event) => {
    if(event.key === 'Enter') {
      console.log(currentSalon);

      socket.emit('chat', {p1: currentSalon, p2: event.target.value});
      event.target.value = "";
    }
  }

  //emit les alon cree par l'utilisateur a tous les autres utilisateurs
  const sendNewSalon = (event) => {
    if(event.key === 'Enter') {
      console.log(event.target.value)
      socket.emit('addsalon', event.target.value);
      event.target.value = "";
    }
  }

  //handle l'evenement changement de salon quand l'utilisateur clique pour changer de salon
  //ferme connection sur le channel de l'ancier salon, le setCurrentSalon trigger le useEffect qui va faire ecouter l'utilisateur sur le nouveau salon
  const handleClick = (salon) => {
    if (salon !== currentSalon)
      socket.off(currentSalon);
    setCurrentSalon(salon);
  };


 

  return (
    <div style={chatStyle}>
      {/* Barre de recherche d'un user + affichage de userFound */}
      <div>
        <p>Search a user</p>
        <input type='text' onKeyPress={displayUser} />
        <Modale revele={revele} toggle={toggle} name={userFound.login} />
      </div>

      {/* Affichage de l'array Salons par iteration */}
      {salons.map((salon) => ( 
      <button onClick={() => handleClick(salon)}>
          {salon}
        </button>))}
        {/* Barre d'input pour ajouter un salon */}
      <div>"Add a salon"</div>  
        <input type='text' onKeyPress={sendNewSalon} />
        {/* Barre d'input pour ajouter un message */}
      <input type='text' onKeyPress={sendMessage} />
      {/* Affichage de la variable message detenant tout l'historique des messages*/}
      {message.map((msg) => (
        <div>{msg}</div>
      ))}
   </div>
  );
}

export default Chat