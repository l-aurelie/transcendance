/* aurel */
import axios from "axios";
import Friends from './friends'
import FriendReqs from './friendreqs'
import { useEffect, useState } from "react";
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MatchHistory from "./MatchHistory";
import Leaderboard from "./Leaderboard";
import UserFormAvatar from "./UserFormAvatar";
import UserForm from "./UserForm";

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const UserProfilExtended = ({user, reqnotif, toggleProfil}) => {
    
   // const [user, setUser] = useState([] as any);
    const [wins, setWins] = useState([]);
    const [losses, setLosses] = useState([]);
    const [history, setHistory] = useState([]);
    const [ranking, setRanking] = useState([]);

    const [reveleHistory, setReveleHistory] = useState(false);
    const toggleHistory = () => {setReveleHistory(!reveleHistory);} 
    //---
    const [reveleForm, setReveleForm] = useState(false);
    const toggleForm = () => {setReveleForm(!reveleForm);} 
    
    useEffect(() => {
        //axios.get("http://localhost:3000/users/" + myuser.login, {withCredentials:true}).then((res) =>{
        //console.log('User profil extended : ', res.data);
        //setUser(res.data);
        //})

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
            <h1 style={{display:'flex', justifyContent:'center', marginBottom:'0'}}>{user.login}</h1>
            <div style={{display:'flex', justifyContent:'center', paddingTop:'0'}}><p><button onClick={toggleForm}>Set profil</button></p></div><br></br>
            <ModalWindow revele={reveleForm} setRevele={toggleForm}>
                <div style={{display:'flex', justifyContent:'space-around'}}>
                <div style={{width:'50%', height:'auto', borderRight:'solid', borderColor:'grey'}}><h2>Change your informations</h2><UserForm user={user} toggle={toggleForm}/></div>
                <div><h2>Change your photo</h2><UserFormAvatar user={user} toggle={toggleForm}/></div>
                </div>
            </ModalWindow>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <div>Victoires: {wins} </div>
                <div>Defaites: {losses} </div>
                <div>Ranking: {ranking} </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <div><Friends user={user} toggleProfil={toggleProfil}></Friends></div>
                <div><FriendReqs reqnotif={reqnotif}></FriendReqs></div>
                <div><Leaderboard></Leaderboard></div>
                <div><button onClick={toggleHistory}>Match History</button></div>
            </div>
            <ModalWindow revele={reveleHistory} setRevele={toggleHistory}>
                <MatchHistory history={history}></MatchHistory>
            </ModalWindow>
        </div>
    );
}

export default UserProfilExtended