/* aurelie */
import axios from "axios";

import { useEffect, useState } from "react";
import { socket } from "../pages/Socket";

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

  const [message, setMessage] = useState([]);// Tous les users de la db
  const [newData, setNewData] = useState([]);// Tous les users de la db
  const [users, setUsers] = useState([]);// Tous les users de la db
  const [userFound, setUserFound] = useState([]); //Contient l'utilisateur si trouve

  /* Recupere tout les utilisateur, 1x slmt (componentDidMount) */
  useEffect(() => {
    axios.get("http://localhost:3000/users/all", { withCredentials: true }).then((res) => {
      setUsers(res.data);
    });

  }, [])

  useEffect(() => {
    socket.on("chat", data => {
      setMessage((message) => {
        //data = {'\n'} + data;
        return ([...message, data]); });
      console.log(socket.id);
     });
    }, [])


  const sendMessage = (event) => {
    if(event.key === 'Enter') {
      socket.emit('chat', event.target.value);
      event.target.value = "";
    }
  }


  /* A chaque changement dans linput, verifie si trouve le user */
  const handleChangeText = (event) => {
    // console.log(event.target.value);
    console.log(userFound);
    /* Recherche dans le tableau users sil trouve le user cherche */
    const res = users.find(element => event.target.value === element.login);
    if (res) {
      setUserFound(res);
    }
    else {
      setUserFound('User not found');
    }
  }

  return (
    <div style={chatStyle}>
      {/* Barre de recherche d'un user + affichage de userFound */}
      <div>
        <input type='text' onChange={handleChangeText} />
      </div>
      <p>{userFound.login}</p>
      <p>{JSON.stringify(userFound)}</p>
      <input type='text' onKeyPress={sendMessage} />
      {message.map((msg) => (
        <div>{msg}</div>
      ))}
   </div>
  );
}

export default Chat