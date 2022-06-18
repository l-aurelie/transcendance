/* Laura */
import axios from "axios";
import { useEffect, useState } from "react";

const friendProfileStyle = {
    alignItems: 'center',
    justifyContent: 'center',
}

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const FriendUserProfilExtended = ({Value}) => {
    
    const message = null;
    const [ThisUser, setThisUser] = useState([]);
    const [friends, setFriends] = useState([]);
    //const [Mybool, setMybool] = useState([]);
   
useEffect(() => {
    axios.get("http://localhost:3000/users/" + Value, {withCredentials:true}).then((res) => { 
        console.log("http://localhost:3000/users/" + Value);
      setThisUser(res.data);
    })
    axios.get("http://localhost:3000/users/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    setFriends(res.data);
    })
    /*axios.get("http://localhost:3000/users/friendRequest/me/hasSent/" + ThisUser, {withCredentials:true}).then((res) =>{
    setMybool(res.data);
    console.log(res.data);*/
    //})
});
    

    const sendFriendRequest = event => {
       
        axios.get("http://localhost:3000/users/FriendRequest/send/" + ThisUser.id, {withCredentials:true}).then((res) => {
        const mess = res.data.error;
        console.log(mess, typeof(mess));
        if (typeof(mess) === 'string')
        {
            const str = JSON.stringify(mess);
            alert(str);
        }
        else
            alert("Friend request sent");
        })
}   

    if(!ThisUser)
    return(
        <div style={friendProfileStyle}>
            <div><h1>This user does not exist</h1></div>
        </div>
    );

    
    /*if (Mybool)
    return(
        <div style={friendProfileStyle}>
            <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={ThisUser.avatar} />
            <div><h1>{ThisUser.login}</h1></div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <p>Already added you :)</p>
        </div>
    );*/
    /*TODO ADD ACCEPT BUTTON ^*/
    
    var result = friends.map(a => a.login);
    console.log("RESULT", result);
    if (result.includes(ThisUser.login))
    {
    return(
        <div style={friendProfileStyle}>
            <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={ThisUser.avatar} />
            <div><h1>{ThisUser.login}</h1></div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <p>Friend :)</p>
        </div>
    );
    }
    //TODO ADD ACCPET OPTION IF THEY HAVE SENT YOU A FRIEND REQUEST
    else 
    return(
        <div style={friendProfileStyle}>
            <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={ThisUser.avatar} />
            <div><h1>{ThisUser.login}</h1></div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <button onClick={sendFriendRequest}>Send Friend Request</button>
            
        </div>
    );
}

export default FriendUserProfilExtended