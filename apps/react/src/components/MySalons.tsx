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

    
    const [friends, setFriends] = useState([] as any);
    const [currentSalon, setCurrentSalon] = useState([] as any);// Salon courant
    const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
    const [message, setMessage] = useState([] as any);// Message a envoyer au salon

    useEffect(() => {
        props.callBack({msg: message, curSal: currentSalon});
    }, [message, currentSalon])

    /*get friendlist*/
    useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
}, [])


           useEffect(() => {
               console.log(joinedSalons);
           }, [joinedSalons])
        //Ecoute chat pour afficher tout nouveaux messages
        useEffect(() => {
            socket.off('chat');
            console.log('FIRST USE EFFECT', currentSalon);
            if (currentSalon.length !== 0) {
                socket.on('fetchmessage', data => {
                    setMessage(data);
                });
                socket.emit('fetchmessage', {nameSalon: currentSalon.name, idUser: props.actualUser.id});
            }
            socket.on("chat", data => {
                setMessage((message) => {
                    //si l'emittingRoom est le salon courant on update les messages, sinon on met une notif si c'est indiqué par .dontNotif
                if (data.emittingRoom === currentSalon.name)
                    return ([...message, data.message]);
                else if (data.dontNotif)
                    return (message);
                else {
                    setJoinedSalons(map => new Map(map.set(data.emittingRoom, {...map.get(data.emittingRoom), dm: (data.emittingRoom !== data.displayName), notif: true, avatar: data.displayName})));
                    return (message);
                }
            });
            });
            }, [currentSalon])

            //Ecoute sur le channel newsalon pour ajouter les salons lorsqu'un utilisateur en cree
            //TODO: est-ce que rejoindre un salon le met en salon courant? (commentaires)
            useEffect(() => {
            socket.on('joinedsalon', data => {
                console.log('iciii', data.displayName);
                setJoinedSalons(map => new Map(map.set(data.salonName, {notif: false, dm: data.dm, avatar: data.displayName})));
                //socket.off('chat');
                //socket.off('fetchmessage');
                //setCurrentSalon({name: data.salonName, isDm: data.dm, display: data.chatterLogin});
            });
            }, [])

            
            const handleClick = (salon) => {
                  if (salon[1].avatar !== currentSalon.display) {
                    setJoinedSalons(map => new Map(map.set(salon[0], {...map.get(salon[0]), notif: false})));            
                    socket.off('chat');
                    socket.off('fetchmessage');
                    setCurrentSalon({name: salon[0], display: salon[1].avatar, isDm: salon[1].dm});
                  }
                };

            const closeSalon = (salon) => {
                console.log('closeSalon');
                joinedSalons.delete(salon);
                const map2 = new Map(joinedSalons);
                setJoinedSalons(map2);
                socket.emit('user_leaves_room', {userId: props.actualUser.id, room: salon});
                if (salon === currentSalon.name) {
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
            <button onClick={() => {handleClick(salon)}}>
                    
            {
            salon[1].notif ?
            <div style={notifSalon}>
                {salon[1].avatar}
            </div>
            :
                <div style={salonName}>
                {salon[1].avatar}
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
