import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { socket } from "./Socket";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
import CSS from 'csstype';
import Select from 'react-select';
import { useResolvedPath, useRoutes } from 'react-router-dom';


/* John aurelie */
const imgStyle = {
    height: '45px',
    width: '45px',
    backgroundColor: 'grey',
    borderRadius: '100%'
}

const bar = {
    display: "flex",
    justifyContent: "center",
    width: '100%'
}

const channelName = {
    width: "10%",
    display: "flex",
}

const channel = {
    width: "100%",
    // backgroundColor: 'green',
    display: "flex",
    justifyContent: "space-around",
}

const buttons = {
    display: "flex",
    justifyContent: "end",
}

const setting = {
    display: 'flex',
    justifyContent: "center",
}


const modalBackground: CSS.Properties = {
  
}

const modalContainer: CSS.Properties = {
    // width: "500px",
    // height: "500px",
    // borderRadius: "12px",
    // backgroundColor: "white",
    // boxShadow: "ragb(0,0,0,0.35) 0px 5px 15px",
    // display:"flex",
    // flexDirection: "column",
    // padding: "25px",

}

const body ={

}

const containerSetting = {

}

/* WIP : liste de display des amis et myChannels pour pouvoir changer le currentChannel*/
const MySalons = (props) => {

    
    const [friends, setFriends] = useState([] as any);
    const [currentSalon, setCurrentSalon] = useState([] as any);// Salon courant
    const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
    const [message, setMessage] = useState([] as any);// Message a envoyer au salon

    const [usersRoom, setUsersRoom] = useState([]);
    const [isAdmin, setIsAdmin] = useState([]);
    const [owner, setOwner] = useState([] as any);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const [revele2, setRevele2] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    const toggleModal2 = () => {setRevele2(!revele2);} 
    /*------*/
    const pwdRef = useRef(null);
    const [pwd, setPwd] = useState([''] as any); 
    
    useEffect(() => {
        //setMessage(message.sort((a, b) => (a.id > b.id) ? 1 : -1));
        props.callBack({msg: message, curSal: currentSalon});
    }, [message, currentSalon])

    /*get friendlist*/
    useEffect(() => {
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
        axios.get("http://localhost:3000/users/userRooms/" + props.actualUser.id, {withCredentials:true}).then((res) =>{
            for (let entry of res.data)
                setJoinedSalons(map =>new Map(map.set(entry.salonName, {notif: false, dm: entry.dm, avatar: entry.displayName, roomId: entry.roomId, creator: entry.creator, owner: entry.isAdmin })))
            console.log('after axios userRooms',res.data);
            })

    }, [])

    useEffect(() => {
        console.log(joinedSalons);
    }, [joinedSalons])
        
    //Ecoute chat pour afficher tout nouveaux messages
    useEffect(() => {
        socket.off('chat');
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
            {
                //   return ([...message, data.message]);
                return ([...message, data]);
            }
            else if (data.dontNotif)
                return (message);
            else {
                socket.off('leftsalon');
                setJoinedSalons(map => new Map(map.set(data.emittingRoom, {...map.get(data.emittingRoom), dm: (data.emittingRoom !== data.displayName), notif: true, avatar: data.displayName, roomId:data.roomId, creator: data.currentSalon})));
                return (message);
            }
            });
        });
    }, [currentSalon])

    //Ecoute sur le channel joinedsalon pour ajouter les salons rejoints par l'user, dans ce socket ou un autre
    //TODO: est-ce que rejoindre un salon le met en salon courant? (commentaires)
    useEffect(() => {
    socket.on('joinedsalon', data => {
        socket.off('leftsalon');
        setJoinedSalons(map => new Map(map.set(data.salonName, {notif: false, dm: data.dm, avatar: data.displayName, roomId: data.roomId, owner: data.isAdmin, creator : data.creator })));
        console.log("Owner ==> ", owner);
        //socket.off('chat');
        //socket.off('fetchmessage');
        //setCurrentSalon({name: data.salonName, isDm: data.dm, display: data.chatterLogin});
    });
    }, [joinedSalons])

    //Ecoute sur le channel leftsalon pour suivre les sorties de salon dans n'importe quel socket
    //Le hook étant sur joinedSalon, il faut socket.off 'leftsalon' à chaque modif de joinedSalons
    useEffect(() => {
    socket.on('leftsalon', salon => {
    //On crée un nouvel objet map pour déclencher les hooks lors de l'activation du setter
        joinedSalons.delete(salon);
        const map2 = new Map(joinedSalons);
        socket.off('leftsalon');
        setJoinedSalons(map2);
        if (salon === currentSalon.name) {
            setMessage([]);
            setCurrentSalon([]);
            socket.off('chat');
            socket.off('fetchmessage');
        }
        });
    }, [joinedSalons])

    const handleClick = (salon) => {
        console.log('handleclick my salon');
        if (salon[1].avatar !== currentSalon.display) {
            socket.off('leftsalon');           
            setJoinedSalons(map => new Map(map.set(salon[0], {...map.get(salon[0]), notif: false, roomId:salon[1].roomId, creator:salon[1].creator})));            
            socket.off('chat');
            socket.off('fetchmessage');
            setCurrentSalon({name: salon[0], display: salon[1].avatar, isDm: salon[1].dm, owner: salon[1].owner, roomId: salon[1].roomId, creator:salon[1].creator});
            }

            axios.get("http://localhost:3000/users/test/" + currentSalon.roomId, {withCredentials:true}).then((res) => {
        console.log('RES.DATA ==> ', res.data);

        const tab = [];
        var def;
    
        for (let entry of res.data) {
            def= {value:entry.user.id, label: entry.user.login, admin:entry.isAdmin}
            tab.push(def);
        }
        setUsersRoom(tab);
        console.log('After created a tab user in ROOM ==> ', usersRoom);
        });     
    };

    const closeSalon = (salon) => {
        //A la fermeture d'un salon, on en informe le back qui va renvoyer
        // sur le canal leftsalon l'information du leave, pour que tous les sockets soient informés
        socket.emit('user_leaves_room', {userId: props.actualUser.id, room: salon});
    };

    const submitPassword = (event) => {
    if (pwd !== "") {
        setPwd(pwdRef.current.value);
        event.preventDefault();
        console.log('pwd => ', pwdRef.current.value);
        axios.post("http://localhost:3000/users/changemdp/" + currentSalon.roomId + "/" +  pwdRef.current.value, {withCredentials:true}).then((res) => {
        });
        event.target.reset(); //clear all input values in the form
        return;
    }
};
    
    const resetPassword = (event) => {
        event.preventDefault();
        axios.post("http://localhost:3000/users/resetpwd/" + currentSalon.roomId, {withCredentials:true}).then((res) => {
        });
        console.log('pwd to DELETE => ', pwd);
        
    };
    
    const addAdmin = (event) => {
        console.log('add this friend in admin for this salon '  + event.label);
        console.log('Users in Room ==> ', usersRoom);
        axios.post("http://localhost:3000/users/setAdminTrue/" + currentSalon.roomId + "/" + event.value, {withCredentials:true}).then((res) => {
            console.log("in set amdin true");
        });
        console.log("is admin ===>" + currentSalon.roomId, 'event.value =', event.value, event.label);
    }

    const muteUser = (event) => {
        console.log('mute this guy'   + event.label);
        //sokcet emit('addAdmin') with 
            //event.label -> login to mute
            //room on va avoir besoin de salon.......
    }

    const banUser = (event) => {
        console.log('Ban this guy'   + event.label);
        //sokcet emit('addAdmin') with 
            //event.label -> login to ban
            //room on va avoir besoin de salon.......
    }

    return(
        <div>   
          {Array.from(joinedSalons.entries()).map((salon) => ( 
            <button key={salon[1].roomId} style={channel} onClick={() => {handleClick(salon)}}>        
            {
            salon[1].notif ?
                <div style={channelName}>{salon[1].avatar}</div>
                :
                <div style={channelName}>{salon[1].avatar}</div>
            }

            {/* modale qui va etre un setting avec close dedans et si owner..... */}
            <div style={buttons}>
                {(salon[1].owner && salon[1].creator === props.actualUser.id) ? <button style={setting} onClick={toggleModal}> ⚙️ </button> : null}
                {(salon[1].owner && salon[1].creator !== props.actualUser.id) ? <button style={setting} onClick={toggleModal2}> ⚙️ </button> : null}
                {/* Setting par channel */}
                {/* <div style={modalBackground}> */}
                <ModalWindow  revele={revele} setRevele={toggleModal}> 
                    {/* <div style={modalContainer}> */}
                        <h1>Owner Settings</h1>
                        <div style={body}></div>
                        <h3>Define password</h3>
                        <div style={containerSetting}>
                            <form onSubmit={submitPassword}>
                            <input
                                ref={pwdRef}
                                id="pwd"
                                name="pwd"
                                type="text"
                            />
                            <button type="submit">Submit</button>
                            </form>
                            <button onClick={resetPassword}>Reset password</button>
                        {/* </div> */}
                        <h3>Add admin's channel</h3>
                        {/* <div style={containerSetting}> */}
                           <div style={bar}>
                            <Select onChange={addAdmin} options={usersRoom}/>
                           </div>   
                        {/* </div> */}
                        <h3>MUTE User</h3>
                        {/* <div style={containerSetting}> */}
                            <div style={bar}>
                            <Select onChange={muteUser} options={usersRoom}/>
                            </div>   
                            <h3>BAN User</h3>
                            <div style={containerSetting}>
                            <div style={bar}>
                            <Select onChange={banUser} options={usersRoom}/>
                            </div> 
                            </div>
                            {/*<h1>Admins : </h1>*/}
                            {/* <div style={body}>
                                {usersRoom.map((user) => 

                                <p key={user.id}>{usersRoom.admin}</p>) }
                           </div> */}
                        {/* </div> */}
                    </div>
                </ModalWindow>
                <ModalWindow  revele={revele2} setRevele={toggleModal2}> 
                    {/* <div style={modalContainer}> */}
                        <h1>Admin Settings</h1>
                        <div style={body}></div>
                        {/* </div> */}
                        <div style={containerSetting}>
                        <h3>MUTE User</h3>
                        {/* <div style={containerSetting}> */}
                            <div style={bar}>
                            <Select onChange={muteUser} options={usersRoom}/>
                            </div>   
                            <h3>BAN User</h3>
                            <div style={containerSetting}>
                            <div style={bar}>
                            <Select onChange={banUser} options={usersRoom}/>
                            </div> 
                            </div>
                            {/*<h1>Admins : </h1>*/}
                            {/* <div style={body}>
                                {usersRoom.map((user) => 

                                <p key={user.id}>{usersRoom.admin}</p>) }
                           </div> */}
                        {/* </div> */}
                    </div>
                </ModalWindow>
                {/* </div> */}
                {/* Permet de quitter le channel */}
            <div><button style={setting} onClick={(event) => {
                event.stopPropagation();
                closeSalon(salon[0])}}
                > x </button></div>
                </div>
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
