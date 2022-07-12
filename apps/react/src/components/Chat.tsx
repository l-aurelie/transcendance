/* aurelie John sam*/
import { useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
import MySalons from "./MySalons";
import { markAsUntransferable } from "worker_threads";
import { defaultIfEmpty } from "rxjs";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import FriendUserProfilExtended from './FriendUserProfileExtended';
import Defeat from './Defeat';
/* Style (insere dans la div jsx) */

const chatStyle = {
  display: 'flex'
}

const mySalonStyle = {
  display: 'flex',
  width: "40%",
  height: '100vh',
  backgroundColor: 'yellow',
  flexDirection: 'column' as 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
}

const messageStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'dark',
  width: '60%',

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
        socket.emit('chat', {roomId: currentSalon.roomId, creator: currentSalon.creator, private:currentSalon.private, roomToEmit: currentSalon.name, message : event.target.value, whoAmI: actualUser, isDm: currentSalon.isDm});
      event.target.value = "";
      console.log(joinedSalons);
    }
  }

//if user that ask to play quit window for accept or reject the request disappear
  useEffect(() => {
    socket.on("noMoreMatch", data => {
      setRevele(false);
    });
      socket.on("ask-defeat", data => {
      setDefeatUser(data.user);
        setVersion(data.version);
        toggleModal();
    });
},[actualUser])

//open user profil when clic on profil on menu
const getUserProfil = () => {
  toggleModal2();
  closeMenu();
}

//set version of game whern defeat someone and send the request to other user
const defeat = (smash) => {
  setShow(false);
  socket.emit('defeat', actualUser, userIdClick, smash);
  closeMenu();
  console.log('smash=', smash);
}

//open menu on 1fst click  on name on chat
const actionUser = (event, data) => {
  setUserIdClick(data.sender);
  setUserLogClick(data.senderLog);
  setAnchorPoint({x:event.pageX, y: event.pageY});
  if (data.sender === actualUser.id)
    setSame(true);
  else
    setSame(false);
  setShow(true);
}

//close menu on 2nd click  on name on chat
const closeMenu = () => {
  setShow(false);
}

    const handleCallback = (childData) =>{
      setMessage(childData.msg);
      console.log('childata.msg = ', childData.msg);
      setCurrentSalon(childData.curSal);
      console.log('sur sur', childData);
  }

  //permet de scroll en bas lors de nouveaux msg
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
      {/*modale qui apparaissent seulement si elle sont demande: userProfil et lorsque l' utilisateur est defie par un autre */}
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
          {/*apparait seulement lorsqu' on clic surle nom d' un utilisateur */}
          {show ? (<div style={{
            fontSize: '14px', backgroundColor:'#D7677E', width : '100px', height:'auto',
            position:'absolute' as 'absolute', top:anchorPoint.y+5, left:anchorPoint.x-90}}>
              <b style={{textAlign:'center', cursor:'pointer'}} onClick={closeMenu}>▲</b>
              <p style={overLi} onClick={getUserProfil}>Profil</p>
              { same ?  <></> : (<div><p style={overLi} onClick={() => defeat(0)}>Defeat pong</p>
              <p style={overLi} onClick={() => defeat(1)}>Defeat smash</p></div>) }
            </div>): null }
            {/*affiche les message sous forme nom: message */}
            <p > { show ? <b style={over} onClick={closeMenu} >{data.senderLog}</b>: <b style={over} onClick={event => actionUser(event, data)} >{data.senderLog}</b>} : {data.message}</p>
          </div>

      ))}
      {/*permet de scroll au dernier message*/}
      <div ref={messagsEndRef}></div> 
        {/* Barre d'input pour ajouter un message */}
        </div>
            

        <input type='text' onKeyPress={sendMessage} />
      
      
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
/* Barre de recherche d'un user + affichage de userFound
      <div>
        <p>Search a user</p>
        <input type='text' onKeyPress={displayUser} />
        <Modale revele={revele} toggle={toggle} name={userFound.login} />
      </div>*/