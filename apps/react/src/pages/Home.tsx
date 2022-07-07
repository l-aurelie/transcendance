/* Manon aurelie */

// import { Component } from '../components/ModaleWindow/LogiqueModale2';
// import Socket from './Socket';

import Logo from '../components/Logo';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
import Chat from '../components/Chat';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {socket} from '../components/Socket';
import SideBarChat from '../components/SideBatChat';


/* Style (insere dans la div jsx) */
const headStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}

/*
const background = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
*/

const bodyStyle = {
    display: 'flex',
    width:"100%",
    height: "100vh",
    // objectFit: "contain",
    justifyContent: 'center',
    //justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}

const chatStyle = {
    width: "30%",
}

const gameStyle = {
    width: "70%",
    flexDirection: "column", // pour que le bouton soit en dessous du jeu
}

// export interface IProfil {

//     id: number;
//     intraId: string;
//     login:  string;
//     avatar:  string;
//     email:  string;
//     authConfirmToken: null;
//     isVerified: boolean;
//     isConnected: boolean;
//     twoFA: boolean;
//     total_wins: number;
//     createAt: string;
// }

const Home = () => {
   
    const [profil, setProfil/*, setlogins*/] = useState([] as any);
    
    //DECOMMENTER POUR AFFICHER L'AVATAR + deccomment ligne 114
    /*
    const [avatar, setAvatar] = useState([] as any);
    useEffect(() => {        
        axios.get("http://localhost:3000/users/getImg", { withCredentials:true, responseType: "blob" }).then((res) =>{ 
            console.log('getImg()');
            //console.log("type = ", typeof res.data);
            //setAvatar(res.data);
            const blob = res.data;
            const image = URL.createObjectURL(blob);
            setAvatar(image);
            //const imageStream = res.data;
            //const imageBlob =  res.blob();
            //const reader = new FileReader();
            //reader.readAsDataURL(imageBlob);
            //reader.onloadend = () => {
            //const base64data = reader.result;
            //setAvatar(base64data);
            //};
        })
    }, [])*/ 
    
    
    useEffect(() => {        
       axios.get("http://localhost:3000/users", { withCredentials:true })
       .then((res) =>{ 
        setProfil(res.data); 
        socket.emit('whoAmI', res.data);
    })
        .catch(error => {
            if (error.response && error.response.status === 403)
                window.location.href = "http://localhost:4200/";
            })
    }, [])
  /*      axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
        setlogins(res.data); 
      })*/

    if (profil.id)
    {
        return (
        <div>
           {/* <div><img src={avatar} alt="rien" /></div> */} 
           
            <div style={headStyle}>
                <Logo></Logo>
                <UserProfil dataFromParent={profil}></UserProfil>
            </div>

            <div style={bodyStyle}>
                <Game style={gameStyle} dataFromParent={profil}/>
                <SideBarChat user={profil}/>
                <Chat style={chatStyle} dataFromParent={profil}></Chat>
            </div>
        </div>
    );
    }
    else
        return null;    
};

export default Home;

