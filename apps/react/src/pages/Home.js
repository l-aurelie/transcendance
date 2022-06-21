/* Manon aurelie */

import Logo from '../components/Logo';
// import Navigation from '../components/Navigation';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
import Chat from '../components/Chat';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {socket} from '../components/Socket';
import SearchBar from '../components/Searchbar';
import SideBarChat from '../components/SideBatChat';
// import Socket from './Socket';

/* Style (insere dans la div jsx) */
const headStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}
const background = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const bodyStyle = {
    display: 'flex',
    //flexDirection: 'row',
    justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}

const Home = () => {
    const [profil, setProfil/*, setlogins*/] = useState([]);
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
                <SearchBar></SearchBar>
                <Logo></Logo>
                <UserProfil dataFromParent={profil}></UserProfil>
            </div>

            <div style={bodyStyle}>
                <Game dataFromParent={profil}/>
                <SideBarChat dataFromParent={profil}/>
                <Chat dataFromParent={profil}></Chat>
            </div>
        </div>
       
            
       
    );
    }
    else
        return null;    
};

export default Home;

