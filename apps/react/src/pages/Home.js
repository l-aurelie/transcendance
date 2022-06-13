/* Manon aurelie */

import Logo from '../components/Logo';
// import Navigation from '../components/Navigation';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
import Chat from '../components/Chat';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {socket} from '../components/Socket';
// import Socket from './Socket';

/* Style (insere dans la div jsx) */
const headStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}

const bodyStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
}

const Home = () => {
    const [profil, setProfil] = useState([]);
    useEffect(() => {        
        axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
       console.log('in home: ', res.data);
        setProfil(res.data); 
        socket.emit('whoAmI', res.data);
      })
    }, [])
    return (
        <div>
            <div style={headStyle}>
                <Logo></Logo>
                <UserProfil dataFromParent={profil}></UserProfil>
            </div>
            <div style={bodyStyle}>
                <Game></Game>
                <Chat dataFromParent={profil}></Chat>
            </div>
        </div>
       
            // {/* <Navigation></Navigation> */}
            // <UserProfil></UserProfil>
            // <Game></Game>
       
    );
};

export default Home;

