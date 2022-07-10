/* aurel */
import axios from "axios";
import Friends from './friends'
import FriendReqs from './friendreqs'
import { useEffect, useState } from "react";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MatchHistory from "./MatchHistory";
import Leaderboard from "./Leaderboard";

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const UserProfilExtended = ({myuser}) => {
    
    const [user, setUser] = useState([] as any);
    const [wins, setWins] = useState([]);
    const [losses, setLosses] = useState([]);
    const [history, setHistory] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    
    useEffect(() => {
        axios.get("http://localhost:3000/users/" + myuser.login, {withCredentials:true}).then((res) =>{
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
            <div style={{display:'flex', justifyContent:'center'}}>
                <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt='profilImage' src={user.avatar} />                  
            </div>
            <h1 style={{display:'flex', justifyContent:'center'}}>{user.login}</h1>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <div>Victoires: {wins} </div>
                <div>Defaites: {losses} </div>
                <div>Ranking: {ranking} </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-around'}}>
             <p><Friends></Friends></p>
            <p><FriendReqs></FriendReqs></p>
            <p><Leaderboard></Leaderboard></p>
            <p><button onClick={toggleModal}>Match History</button></p>
        </div>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <MatchHistory history={history}></MatchHistory>
            </ModalWindow>
        </div>
    );
}

export default UserProfilExtended