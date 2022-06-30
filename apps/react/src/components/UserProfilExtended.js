/* aurel */
import axios from "axios";
import Friends from './friends.tsx'
import FriendReqs from './friendreqs.tsx'
import { useEffect, useState } from "react";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MatchHistory from "./MatchHistory.tsx";
import Leaderboard from "./Leaderboard.tsx";


//TODO: Rendre l'affichage conditionnel (selon si current user) de logout, setProfile
//TODO: Formulaire de modif / d'intialisation des donnees a l'inscription
//TODO: Profil rechecher : addFriend, ecrire un message, defier
//TODO: Ajouter logout bouton ici
//TODO: Ajouter 2fa, victoire, defaire et niveau a la db

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const UserProfilExtended = ({name}) => {
    
    const [user, setUser] = useState([]);
    const [wins, setWins] = useState([]);
    const [losses, setLosses] = useState([]);
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        axios.get("http://localhost:3000/users/" + name, {withCredentials:true}).then((res) =>{
        console.log('User profil extended : ', res.data);
        setUser(res.data);
        })

        axios.get("http://localhost:3000/stats/getWins", {withCredentials:true}).then((res) =>{
        console.log('User profil extended : ', res.data);
        setWins(res.data);
        })

        axios.get("http://localhost:3000/stats/getLosses", {withCredentials:true}).then((res) =>{
        console.log('User profil extended : ', res.data);
        setLosses(res.data);
        })

        axios.get("http://localhost:3000/stats/getMatchHistory", {withCredentials:true}).then((res) =>{
        console.log('THE DATA : ', res.data);
        setHistory(res.data);
        })

    }, [])
    
    return(
        <div>
            <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={user.avatar} />
            <button>SetProfil</button>
            <div>{user.login}</div>
            <p>Victoires: {wins} </p>
            <p>Defaites: {losses} </p>
            <p>Ligue []</p>
            <div>{user.email}</div>
            <Friends></Friends>
            <FriendReqs></FriendReqs>
            <Leaderboard></Leaderboard>
            <button onClick={toggleModal}>Match History</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
            <MatchHistory history={history}></MatchHistory>
            </ModalWindow>
            <div>2fa</div>
            <button>Logout</button>
        </div>
    );
}

export default UserProfilExtended