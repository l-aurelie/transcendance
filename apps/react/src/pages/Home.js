/* Manon aurelie */

import Logo from '../components/Logo';
// import Navigation from '../components/Navigation';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
// import Socket from './Socket';


const Home = () => {
  
    return (
        <div>
            <Logo></Logo>
            {/* <Socket></Socket> */}
            <UserProfil></UserProfil>
            <Game></Game>
        </div>
       
            // {/* <Navigation></Navigation> */}
            // <UserProfil></UserProfil>
            // <Game></Game>
       
    );
};

export default Home;

