import axios from 'axios';
import React, { useState, useEffect } from 'react';

/* John aurelie */
const imgStyle = {
    height: '45px',
    width: '45px',
    backgroundColor: 'grey',
    borderRadius: '100%'
}

/* WIP : liste de display des amis et myChannels pour pouvoir changer le currentChannel*/
 const MySalons = () => {

    
    const [friends, setFriends] = useState([]);
    /*get friendlist*/
    useEffect(() => {
    axios.get("http://localhost:3000/users/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
        setFriends(res.data);
        })
}, [])
    return(
        <div>
            <p>WIP : listes des amis et des channels rejoint, onClick, devient le channel courant de discussion du chat</p>
            {friends.map(friends => (
            <p><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={friends.avatar}/> {friends.login} | Spectate | Defeat |<br></br></p>
            ))}
            {/* PlaceHolder 
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div><img style={{maxWidth: '20px', maxHeight: '20px', borderRadius: '100%' }} src={friends.avatar}/><p> | {friends.login} Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
    </div>*/}

        </div>
    );
 };

 export default MySalons;
