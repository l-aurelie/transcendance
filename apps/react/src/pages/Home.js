/* Manon aurelie */

import Logo from '../components/Logo';
// import Navigation from '../components/Navigation';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';


const Home = () => {
    return (
        <div>
            <Logo></Logo>
            {/* <Navigation></Navigation> */}
            <UserProfil></UserProfil>
            <Game></Game>
        </div>
    );
};

export default Home;

