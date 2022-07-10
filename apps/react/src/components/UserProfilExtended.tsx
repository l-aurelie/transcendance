/* aurel */
import axios from "axios";
import Friends from './friends'
import FriendReqs from './friendreqs'
import { useEffect, useState } from "react";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MatchHistory from "./MatchHistory";
import Leaderboard from "./Leaderboard";

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const UserProfilExtended = ({name}) => {
    
    const [user, setUser] = useState([] as any);
    const [wins, setWins] = useState([]);
    const [losses, setLosses] = useState([]);
    const [history, setHistory] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    
    useEffect(() => {
        axios.get("http://localhost:3000/users/" + user.name, {withCredentials:true}).then((res) =>{
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

        axios.get("http://localhost:3000/stats/getRanking", {withCredentials:true}).then((res) =>{
        setRanking(res.data);
        })

    }, [])
    
    return(
        <div>
            <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} alt='profilImage' src={user.avatar} />
            <button>SetProfil</button>
            <div>{user.login}</div>
            <p>Victoires: {wins} </p>
            <p>Defaites: {losses} </p>
            <p>Ranking: {ranking} </p>
            <div>{user.email}</div>
             <Friends></Friends>
            <FriendReqs></FriendReqs>
            <Leaderboard></Leaderboard>
            <button onClick={toggleModal}>Match History</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <MatchHistory history={history}></MatchHistory>
            </ModalWindow>
            <div>2fa</div>
        </div>
    );
}

export default UserProfilExtended