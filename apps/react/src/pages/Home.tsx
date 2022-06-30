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
import SearchBar from '../components/Searchbar';
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
    height: "85vh",
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
    useEffect(() => {        
        axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
       console.log('in home: ', res.data);
        setProfil(res.data); 
        socket.emit('whoAmI', res.data);
    })
  /*      axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
        setlogins(res.data); 
      })*/
    }, [])
    if (profil.id)
    {
        return (
        <div>
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

