import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { socket } from "./Socket";

/* John aurelie */
const imgStyle = {
    height: '45px',
    width: '45px',
    backgroundColor: 'grey',
    borderRadius: '100%'
}

const lists = {
    overflowY: 'scroll'
}

const salonName = {
    marginTop: "auto", 
  
  }
  
  const notifSalon = {
    marginTop: "auto", 
    backgroundColor: 'pink',
  }
  

/* WIP : liste de display des amis et myChannels pour pouvoir changer le currentChannel*/
 const MySalons = (props) => {

    
    const [friends, setFriends] = useState([]);
    const [currentSalon, setCurrentSalon] = useState([]);// Salon courant
    const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
    const [message, setMessage] = useState([]);// Message a envoyer au salon

    useEffect(() => {
        props.callBack({msg: message, curSal: currentSalon});
    }, [message, currentSalon])

    /*get friendlist*/
    useEffect(() => {
    axios.get("http://localhost:3000/users/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
}, [])

  //Ecoute chat pour afficher tout nouveaux messages
        useEffect(() => {
            socket.off('chat');
            console.log('FIRST USE EFFECT', currentSalon);
            if (currentSalon.length !== 0) {
            socket.on('fetchmessage', data => {
                console.log(typeof data, data);
                setMessage(data);
            });
            socket.emit('fetchmessage', currentSalon);
            }
            socket.on("chat", data => {
                console.log("paricitestests");
                setMessage((message) => {
                    console.log(currentSalon);
                console.log('origin vs currentSalon', data.emittingRoom, currentSalon)
                if (data.emittingRoom === currentSalon)
                    return ([...message, data.message]);
                else {
                    setJoinedSalons(map => new Map(map.set(data.emittingRoom, true)));
                    return (message);
                }
            //});
            });
            });
            }, [currentSalon])

            //Ecoute sur le channel newsalon pour ajouter les salons lorsqu'un utilisateur en cree
            useEffect(() => {
            socket.on('joinedsalon', salonName => {
                console.log('iciii', salonName);
                setJoinedSalons(map => new Map(map.set(salonName, false)));
                console.log(joinedSalons);
                socket.off('chat');
                socket.off('fetchmessage');
                setCurrentSalon(salonName);
            });
            }, [])

            
            const handleClick = (salon) => {
                console.log(salon);
                  if (salon !== currentSalon) {
                    console.log('beforeadd', salon, currentSalon);
                    setJoinedSalons(map => new Map(map.set(salon, false)));
                    console.log(joinedSalons);
            
                    socket.off('chat');
                    socket.off('fetchmessage');
                    setCurrentSalon(salon);
                  }
                };

            const closeSalon = (salon) => {
                console.log('closeSalon');
                joinedSalons.delete(salon);
                const map2 = new Map(joinedSalons);
                setJoinedSalons(map2);
                socket.emit('user_leaves_room', {userId: props.actualUser.id, room: salon});
                if (salon === currentSalon) {
                     socket.off('chat');
                     socket.off('fetchmessage');
                     setMessage([]);
                     setCurrentSalon([]);
                }
            };

    return(
        <div>
        {/*<div style={lists}>
            {friends.map(friends => (
            <p><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={friends.avatar}/> {friends.login} | Spectate | Defeat |<br></br></p>
            ))}*/}    
          {Array.from(joinedSalons.entries()).map((salon) => ( 

            <button onClick={() => {handleClick(salon[0])}}>
                    
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
            <button onClick={(event) => {
                event.stopPropagation();
                closeSalon(salon[0])}}
                >x</button>
            </button>))}
            {/* PlaceHolder 
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div><img style={{maxWidth: '20px', maxHeight: '20px', borderRadius: '100%' }} src={friends.avatar}/><p> | {friends.login} Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
    </div>*/}

        </div>
    );
 };

 export default MySalons;
