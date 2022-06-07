/* Manon aurelie */

import Logo from '../components/Logo';
// import Navigation from '../components/Navigation';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
import Chat from '../components/Chat';
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
  
    return (
        <div>
            <div style={headStyle}>
                <Logo></Logo>
                <UserProfil></UserProfil>
            </div>
            {/* <Socket></Socket> */}
            <div style={bodyStyle}>
                <Game></Game>
                <Chat></Chat>
            </div>
        </div>
       
            // {/* <Navigation></Navigation> */}
            // <UserProfil></UserProfil>
            // <Game></Game>
       
    );
};

export default Home;

