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
    const [profil, setProfil, value, setValue] = useState([]);
    useEffect(() => {        
        axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
       console.log('in home: ', res.data);
        setProfil(res.data); 
        socket.emit('whoAmI', res.data);
      })
    }, [])

    const [logins, setlogins] = useState([]);
                     useEffect(() => {        
                         axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
                         setlogins(res.data); 
                       })
                     }, [])


    //const [value, setValue] = useState('');
    /*const onChange = (event) => {
        setValue(event.target.value);
    }
    
    const onSearch = (searchTerm) => {
        setValue (searchTerm);
        console.log('search ', searchTerm);
    }
    return (
        <div>
            <div style={headStyle}>
                <Logo></Logo>
                <UserProfil dataFromParent={profil}></UserProfil>
            </div>
            <div className= "bar holder">
                <h1>Search</h1>

                <div className="search bar wrap">
                    <div className="search bar">
                        <input type = "text" value={value} onChange={onChange} />
                        <button onClick={() =>onSearch(value)} >Search </button>
                    </div>

                    <div className="dropdown">
                    { 
                    
                            logins.filter((item) => {
                            const searchTerm = value.toLowerCase();
                            const login = item.toLowerCase();

                            return ( searchTerm 
                                && login.startswith(searchTerm) 
                                && login !== searchTerm
                            );
                        })
                        .slice(0, 10)
                        .map((item)=> (
                        <div 
                        onClick={() => onSearch(item)}
                        className="row"
                        key={item}>
                            {item};
                    </div>
                        ))}
            </div>
            </div>
            </div>*/
            <div style={bodyStyle}>
                <Game></Game>
                <Chat dataFromParent={profil}></Chat>
            </div>
        
       
            // {/* <Navigation></Navigation> */}
            // <UserProfil></UserProfil>
            // <Game></Game>
       
    );
};

export default Home;

