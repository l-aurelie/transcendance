import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { socket } from "./Socket";
import { ModalWindow } from "./ModaleWindow/LogiqueModale2";
//import CSS from 'csstype';
import Select from 'react-select';
//import { useResolvedPath, useRoutes } from 'react-router-dom';
//import { isBooleanObject } from 'util/types';
//import { ConsoleLogger } from '@nestjs/common';
import AddPrivateMember from './AddPrivateMember';
import OwnerLeave from './OwnerLeave';


/* John aurelie */
// const imgStyle = {
//     height: '45px',
//     width: '45px',
//     backgroundColor: 'grey',
//     borderRadius: '100%'
// }

const bar = {
    display: "flex",
    justifyContent: "center",
    width: '100%'
}

const channelName = {
    width: "70%",
    display: "flex",
}

const channelNameNotif = {
    width: "70%",
    display: "flex",
    backgroundColor: 'pink',

}

const channel = {
    width: "100%",
    // backgroundColor: 'green',
    display: "flex",
    justifyContent: "space-between",
}

// const buttons = {
//     display: "flex",
//     //justifyContent: "space-between",
//     float:'right' as 'right',
// }

// const setting = {
// // position:'relative' as 'relative',
//     //   display: 'flex',
//  //   justifyContent: "center",
//     cursor: 'pointer',
// }

const body ={

}

/* WIP : liste de display des amis et myChannels pour pouvoir changer le currentChannel*/
const MySalons = (props) => {

    
    //const [friends, setFriends] = useState([] as any);
    const [currentSalon, setCurrentSalon] = useState([] as any);// Salon courant
    const [joinedSalons, setJoinedSalons] = useState(new Map()); //Array de tous les salons a afficher, que l'on peut selectionner
    const [message, setMessage] = useState([] as any);// Message a envoyer au salon
    const [banOption, setBan] = useState({value:0, label:''});
    const [muteOption, setMute] = useState({value:0, label:''});
    const [admOption, setAdm] = useState({value:0, label:''});
    const [unmuteOption, setUnmute] = useState({value:0, label:''});
    const [unbanOption, setUnban] = useState({value:0, label:''});
    const [unadmOption, setUnadm] = useState({value:0, label:''});
  //  const [successorOption, setSuccessor] = useState({value:0, label:''});
    const [usersRoom, setUsersRoom] = useState([]);
    const [tabAdm, setTabAdm] = useState([]);
    const [tabBan, setTabBan] = useState([]);
    const [tabMute, setTabMute] = useState([]);
    const [tabNonAdm, setTabNonAdm] = useState([]);
    const [tabNonMute, setTabNonMute] = useState([]);
    const [tabNonBan, setTabNonBan] = useState([]);
    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const [revele2, setRevele2] = useState(false);
    const [revele3, setRevele3] = useState(false);
    const [revele4, setRevele4] = useState(false);
    const [roomId, setRoomId] = useState(0);
    const toggleModal = (salon) => {setRevele(!revele);
    //    setRoomId(salon.id);
} 
    const toggleModal2 = (salon) => {setRevele2(!revele2);
      //  setRoomId(salon.id);
    } 
    const toggleModal3 = (data) => {setRevele3(!revele3);} 
    const toggleModal4 = () => {setRevele4(!revele4);} 
    /*------*/
    const pwdRef = useRef(null);
    const [pwd, setPwd] = useState([''] as any); 
    
    useEffect(() => {
        //setMessage(message.sort((a, b) => (a.id > b.id) ? 1 : -1));
        props.callBack({msg: message, curSal: currentSalon});
    }, [message, currentSalon, props])

    /*get friendlist*/
    useEffect(() => {
    // axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    //     setFriends(res.data);
    //     })
        axios.get("http://localhost:3000/users/userRooms/" + props.actualUser.id, {withCredentials:true}).then((res) =>{
            for (let entry of res.data)
                setJoinedSalons(map =>new Map(map.set(entry.salonName, {notif: false, dm: entry.dm, avatar: entry.displayName, roomId: entry.roomId, creator: entry.creator, owner: entry.isAdmin, private:entry.private })))
            })

    }, [props.actualUser.id])

    useEffect(() => {
    }, [joinedSalons])
        
    //Ecoute chat pour afficher tout nouveaux messages
    useEffect(() => {
        socket.off('chat');
        if (currentSalon.length !== 0) {
            socket.on('fetchmessage', data => {
                setMessage(data);
            });
            socket.emit('fetchmessage', {nameSalon: currentSalon.name, idUser: props.actualUser.id, roomId:currentSalon.roomId});
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
                setJoinedSalons(map => new Map(map.set(data.emittingRoom, {...map.get(data.emittingRoom), dm: (data.emittingRoom !== data.displayName), notif: true, avatar: data.displayName, roomId:data.roomId, creator: data.currentSalon, private: data.private})));
                return (message);
            }
            });
        });
    }, [currentSalon, props.actualUser.id])

    //Ecoute sur le channel joinedsalon pour ajouter les salons rejoints par l'user, dans ce socket ou un autre
    //TODO: est-ce que rejoindre un salon le met en salon courant? (commentaires)
    useEffect(() => {
        socket.on('new-owner', data => {
            console.log('new-Owner');
            axios.get("http://localhost:3000/users/userRooms/" + props.actualUser.id, {withCredentials:true}).then((res) =>{
                for (let entry of res.data)
                    setJoinedSalons(map =>new Map(map.set(entry.salonName, {notif: false, dm: entry.dm, avatar: entry.displayName, roomId: entry.roomId, creator: entry.creator, owner: entry.isAdmin, private:entry.private })))
                })
            
        })
    socket.on('just-block', data => {
        const map2 = new Map(joinedSalons);
        setJoinedSalons(map2);
            setMessage([]);
            setCurrentSalon([]);
    })
    socket.on('joinedsalon', data => {
        socket.off('leftsalon');
        setJoinedSalons(map => new Map(map.set(data.salonName, {notif: false, dm: data.dm, avatar: data.displayName, roomId: data.roomId, owner: data.isAdmin, creator : data.creator, private: data.private})));
       // console.log("Owner ==> ", owner);
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
    }, [joinedSalons, currentSalon.name])

    const handleClick = (salon) => {
        setRoomId(salon[1].roomId)

         if ((revele|| revele2 ||revele3) && currentSalon.roomId !== 'undefined')
             return ;
        if (salon[1].avatar !== currentSalon.display) {
            socket.off('leftsalon');           
            setJoinedSalons(map => new Map(map.set(salon[0], {...map.get(salon[0]), notif: false, roomId:salon[1].roomId, creator:salon[1].creator, private:salon[1].private})));
            socket.off('chat');
            socket.off('fetchmessage');
            setCurrentSalon({name: salon[0], display: salon[1].avatar, isDm: salon[1].dm, owner: salon[1].owner, roomId: salon[1].roomId, creator:salon[1].creator, private:salon[1].private});
            }

            axios.get("http://localhost:3000/users/test/" + currentSalon.roomId, {withCredentials:true}).then((res) => {

        const tab = [];
        var def;
    
        for (let entry of res.data) {
            def= {value:entry.useId, label: entry.userLogin, admin:entry.isAdmin}
            tab.push(def);
        }
        setUsersRoom(tab);
        whichAdm(salon[1].roomId);
        whichBan(salon[1].roomId);
        whichMute(salon[1].roomId);
        whichNonAdm(salon[1].roomId);
        whichNonBan(salon[1].roomId);
        whichNonMute(salon[1].roomId);
        console.log('After created a tab user in ROOM ==> ', usersRoom);
        });
    };
        const whichBan = (idRoom) => {
            axios.get("http://localhost:3000/users/whichBan/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            console.log('whichBan', idRoom);
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            setTabBan(tab);
            console.log('ban', tab);
        });
    }
        const whichNonBan = (idRoom) => {
            axios.get("http://localhost:3000/users/whichNonBan/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            console.log('nonban', tab);
            setTabNonBan(tab);
        });
    }
        const whichMute = (idRoom) => {
            axios.get("http://localhost:3000/users/whichMute/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            console.log('mute', tab);
            setTabMute(tab);
        });
    }
        const whichNonMute = (idRoom) => {
            axios.get("http://localhost:3000/users/whichNonMute/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            console.log('nonmute', tab);
            setTabNonMute(tab);
        });}

        const whichAdm = (idRoom) => {
        console.log('in whichAdm roomId = ', idRoom)

            axios.get("http://localhost:3000/users/whichAdm/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            console.log('adm', tab);
            setTabAdm(tab);
        });}
        const whichNonAdm = (idRoom) => {
        console.log('in whichAdm roomId = ', roomId)
        axios.get("http://localhost:3000/users/whichNonAdm/" + idRoom, {withCredentials:true}).then((res) => {
            const tab = [];
            var def;
            for (let entry of res.data) {
                def= {value:entry.id, label: entry.login}
                tab.push(def);
            }
            console.log('nonadm', tab);
            setTabNonAdm(tab);
        });
    }
            /* on recupere le password de la room actuelle */
            // axios.get("http://localhost:3000/users/pwd/" + currentSalon.roomId, {withCredentials: true}).then((res) => {
            //     console.log('PWD', res.data);
            //     let goodPwd = false;
    
            //     if (res.data === true) {
                    
                 
            //        const pwdInput = prompt('Enter the password to join the room');
            //     //    setPwd(pwdInput);
            //        const inf = {roomId: currentSalon.roomId, pwd: pwdInput};
            //        console.log("PWD === ", pwdInput);
            //         axios.post("http://localhost:3000/users/checkpwd/", inf, {withCredentials: true}).then((res) => {
            //             goodPwd = res.data;
            //             if(!goodPwd)
            //             alert('Wrong password');
            //         })
            //     }
            // });
   

    const closeSalon = (event, salon, salon2) => {
        //A la fermeture d'un salon, on en informe le back qui va renvoyer
        // sur le canal leftsalon l'information du leave, pour que tous les sockets soient informés
        event.stopPropagation();
        socket.emit('user_leaves_room', {userId: props.actualUser.id, room: salon2, roomId: salon.roomId});
    };

    const alertCreator = () => {
        alert('Your the creator, choose a successor before leaving the channel')
                            return;
    }

    const submitPassword = (event) => {
    if (pwd !== "") {
        setPwd(pwdRef.current.value);
        event.preventDefault();
        const inf = { userId : event.value, roomId: currentSalon.roomId, pwd: pwdRef.current.value};
        // console.log('pwd => ', pwdRef.current.value);
        axios.post("http://localhost:3000/users/changemdp", inf, {withCredentials: true}).then((res) => {
        });
        event.target.reset(); //clear all input values in the form withCredentials:true
        alert("Password has been set");
        return;
    }
};
    
    const resetPassword = (event) => {
        const inf = { userId : event.value, roomId: currentSalon.roomId, pwd: ''};
        event.preventDefault();
        axios.post("http://localhost:3000/users/resetpwd", inf, {withCredentials:true}).then((res) => {
        });
        // console.log('pwd to DELETE => ', pwd);
        alert("Password reset to null");

        
    };

    const setaMute = (event) => {
        setMute({value:event.value, label:event.label});
    }
    const setanAdm = (event) => {
        setAdm({value:event.value, label:event.label});
    }
    const setaBan = (event) => {
        setBan({value:event.value, label:event.label});
    }
    const setanUnmute = (event) => {
        setUnmute({value:event.value, label:event.label});
    }
    const setanUnban = (event) => {
        setUnban({value:event.value, label:event.label});
    }
    const setanUnadm = (event) => {
        setUnadm({value:event.value, label:event.label});
    }
    
    const addAdmin = () => {
        const inf = { userId : admOption.value, roomId: currentSalon.roomId, pwd: ''};
        axios.post("http://localhost:3000/users/setAdminTrue" , inf, {withCredentials:true}).then((res) => {
        });
        if (admOption.value !== 0)
        alert(admOption.label + " is now an admin");
        setAdm({value:0, label:''});
        whichAdm(currentSalon.roomId);
        whichNonAdm(currentSalon.roomId);
    }

    const removeAdmin = () => {
        const inf = { userId :unadmOption.value, roomId: currentSalon.roomId, pwd: ''};
        axios.post("http://localhost:3000/users/setAdminFalse" , inf, {withCredentials:true}).then((res) => {
        });
        if (unadmOption.value !== 0)
            alert(unadmOption.label + " is remove of admins");
        setAdm({value:0, label:''});
        whichAdm(currentSalon.roomId);
        whichNonAdm(currentSalon.roomId);
    }
   
    const muteUser = () => {
        const inf = { userId : muteOption.value, roomId: currentSalon.roomId, muteUser: true};
        axios.post("http://localhost:3000/users/mute/", inf, {withCredentials:true}).then((res) => {
    });
        if (muteOption.value !== 0)
            alert(muteOption.label + " muted!");
        setMute({value:0, label:''});
        whichMute(currentSalon.roomId);
        whichNonMute(currentSalon.roomId);
    }
    const unmuteUser = () => {
        const inf = { userId : unmuteOption.value, roomId: currentSalon.roomId, muteUser: true};
        axios.post("http://localhost:3000/users/unmute/", inf, {withCredentials:true}).then((res) => {
    });
        if (unmuteOption.value !== 0)
            alert(unmuteOption.label + " unmuted!");
        setMute({value:0, label:''});
        whichMute(currentSalon.roomId);
        whichNonMute(currentSalon.roomId);
    }

    const banUser = () => {
        const inf = { userId : banOption.value, roomId: currentSalon.roomId, banUser: true};
        axios.post("http://localhost:3000/users/ban/" , inf, {withCredentials:true}).then((res) => {
        });

        socket.emit('user_isBan_room', {userId: banOption.value, room: currentSalon.name, roomId: currentSalon.roomId});
        if (banOption.value !== 0)
           alert(banOption.label + " banned!");
        setBan({value:0, label:''});
        whichBan(currentSalon.roomId);
        whichNonBan(currentSalon.roomId);
    }

    const unbanUser = () => {
        const inf = { userId : unbanOption.value, roomId: currentSalon.roomId, banUser: true};
        axios.post("http://localhost:3000/users/unban/" , inf, {withCredentials:true}).then((res) => {
        });

        socket.emit('user_isBan_room', {userId: banOption.value, room: currentSalon.name, roomId: currentSalon.roomId});
        if (unbanOption.value !== 0)
            alert(unbanOption.label + " unbanned!");
        setBan({value:0, label:''});
        whichBan(currentSalon.roomId);
        whichNonBan(currentSalon.roomId);
    }

    // const admin = (obj) => {
    //     for (let entry of obj)
    //     {
    //         if (entry.admin === true)
    //             return true;
    //     }
    //     return false;
    // }

    // const isEmpty = (obj)  => {
    //     return Object.keys(obj).length === 0;
    // }


    return(
        <div>
        <div style={{overflowY:'scroll' as 'scroll'}}>   
          {Array.from(joinedSalons.entries()).map((salon) => ( 
            <button key={salon[1].roomId} style={channel} onClick={() => {handleClick(salon)}}>
               <div style={{position:'relative' as 'relative', width:'100%', display:'flex', justifyContent:'space-between'}}>
            {
            salon[1].notif ?
                <div style={channelNameNotif}>{salon[1].avatar}</div>
                :
                <div style={channelName}>{salon[1].avatar}</div>
            }

            {/* modale qui va etre un setting avec close dedans et si owner..... */}
                {(salon[1].owner && salon[1].creator === props.actualUser.id) ? <div style={{cursor:'pointer'}} onClick={()=>toggleModal(salon[1])}> ⚙️ </div> : null}
                {(salon[1].owner && salon[1].creator !== props.actualUser.id) ? <div style={{cursor:'pointer'}} onClick={() =>toggleModal2(salon[1])}> ⚙️ </div> : null}
                {/* Setting par channel */}
                
                {/* Permet de quitter le channel */}
                <div>
                    {
                        ((salon[1].creator === props.actualUser.id) ) ?
                        <div style={{cursor:"pointer"}} onClick={alertCreator}>x</div> : <div style={{cursor:"pointer"}} onClick={(event) => closeSalon(event, salon[1], salon[0])}>x</div>
                    }
                </div>
                </div>
            </button>))}
       
    
        </div>
        <ModalWindow  revele={revele} setRevele={toggleModal}> 
                    {/* <div style={modalContainer}> */}
                   
                        <div style={{display:'flex', justifyContent:'center'}}><div><h1>Owner Settings</h1></div><div style={{marginTop:'10px'}}><button onClick={toggleModal4}>Leave Chanel</button></div></div>
                        <OwnerLeave idRoom={currentSalon.roomId} idUser={props.actualUser.id} roomName={currentSalon.name} revele={revele4} toggle={toggleModal4} toggle2={toggleModal} revele2={revele}></OwnerLeave>
                        
                        <div style={body}></div>
                        <div style={{display:'flex', justifyContent:'space-around'}}>
                        {currentSalon.private === true ?  <div><h2>Private room</h2>
                    <button onClick={toggleModal3}>Add members</button>
                        <AddPrivateMember idRoom={currentSalon.roomId} roomName={currentSalon.name} revele={revele3} toggle={toggleModal3} toggle2={toggleModal}></AddPrivateMember>
                    </div> : <></> }
                    {currentSalon.private === false ?
                    <div>
                        <h3>Public Room - Define password</h3>
                        
                            <form onSubmit={submitPassword}>
                            <input
                                ref={pwdRef}
                                id="pwd"
                                name="pwd"
                                type="password"
                            />
                            <button type="submit">Submit</button>
                            </form>
                            <button onClick={resetPassword}>Reset password</button>
                        {/* </div> */}
                        </div> : <></>}
                        </div>
                        <h3>Add/Remove admin's channel</h3>
                        {/* <div style={containerSetting}> */}
                           <div style={bar}>
                            <button onClick={addAdmin}>ADD</button><Select onChange={setanAdm} options={tabNonAdm}/>
                            {tabAdm.length  === 0 ? null :<Select onChange={setanUnadm} options={tabAdm}/>}
                            {tabAdm.length  === 0 ? null :<button onClick={removeAdmin}>REMOVE</button>}
                           </div>
                           
                        {/* </div> */}
                        <h3>Mute/Unmute User</h3>
                        {/* <div style={containerSetting}> */}
                            <div style={bar}>
                            <button onClick={muteUser}>MUTE</button><Select onChange={setaMute} options={tabNonMute}/>
                            {tabMute.length  === 0 ? null :<Select onChange={setanUnmute} options={tabMute}/>}
                            {tabMute.length  === 0 ? null : <button onClick={unmuteUser}>UNMUTE</button>}
                        </div>   
                    <h3>Ban/Unban User</h3>
                    <div style={bar}>
                    <button onClick={banUser}>BAN</button><Select onChange={setaBan} options={tabNonBan}/>
                    {tabBan.length  === 0 ? null : <Select onChange={setanUnban} options={tabBan}/>} 
                    {tabBan.length  === 0 ? null :<button onClick={unbanUser}>UNBAN</button>}
                    </div>
                </ModalWindow>
               


                <ModalWindow  revele={revele2} setRevele={toggleModal2}> 
                    {/* <div style={modalContainer}> */}
                        <h1>Admin Settings</h1>
                        {currentSalon.private === true ?  <div><h2>Private room</h2>
                    <button onClick={toggleModal3}>Add members</button>
                        <AddPrivateMember idRoom={currentSalon.roomId} roomName={currentSalon.name} revele={revele3} toggle={toggleModal3} toggle2={toggleModal2}></AddPrivateMember>
                    </div> : <></> }
                        <div style={body}></div>
                        {/* </div> */}
                        <h3>Mute/Unmute User</h3>
                        {/* <div style={containerSetting}> */}
                            <div style={bar}>
                            <button onClick={muteUser}>MUTE</button><Select onChange={setaMute} options={tabNonMute}/>
                            <Select onChange={setanUnmute} options={tabMute}/><button onClick={unmuteUser}>UNMUTE</button>
                        </div>   
                    <h3>Ban/Unban User</h3>
                    <div style={bar}>
                    <button onClick={banUser}>BAN</button><Select onChange={setaBan} options={tabNonBan}/>
                        <Select onChange={setanUnban} options={tabBan}/><button onClick={unbanUser}>UNBAN</button>
                    </div>
                </ModalWindow>
                {/* Permet de quitter le channel */}
            {//     <div>
            //         {
            //             ((salon[1].owner && salon[1].creator === props.actualUser.id) ) ?
            //             <div style={{cursor:"pointer"}} onClick={alertCreator}>x</div> : <div style={{cursor:"pointer"}} onClick={(event) => closeSalon(event, salon[1], salon[0])}>x</div>
            //         }
            //         {/*&& !isEmpty(usersRoom) && !admin(usersRoom)*/}
            //         {/* <button style={setting} onClick={(event) => {
            //             if ((salon[1].owner && salon[1].creator === props.actualUser.id) && !isEmpty(usersRoom) && !admin(usersRoom)) {
            //                 console.log("ICI" + {usersRoom});
            //                 alert('Your the creator, choose a successor before leaving the channel')
            //                 return;
            //             }
            //             else {
                                
            //                     event.stopPropagation();
            //                     closeSalon(salon[1], salon[0])
            //             }}}> x </button> */}
            //     </div>
            //     </div>
            //     </div> 
            // </button>))}
        }
        </div>
        
    );
 };

 export default MySalons;
