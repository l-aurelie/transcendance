/* Laura */
import axios from "axios";
import { useEffect, useState } from "react";


const friendProfileStyle = {
    alignItems: 'center',
    justifyContent: 'center',
}

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const FriendUserProfilExtended = ({Value}) => {
    
    //const message = null;
    const [ThisUser, setThisUser] = useState([]);
    const [friends, setFriends] = useState([]);
    const [InboundReq, setInboundReq] = useState([]);
   // var test = null;
   
useEffect(() => {
    console.log("GETTING USER");
    axios.get("http://localhost:3000/users/" + Value, {withCredentials:true}).then((res) => { 
      setThisUser(res.data);
    })
    console.log("GETTING FRIEND LIST");
    axios.get("http://localhost:3000/users/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    setFriends(res.data);
    })
    console.log("GETTING USER");
    axios.get("http://localhost:3000/users/friendRequest/me/hasSentMe/" + Value, {withCredentials:true}).then((res) =>{
    setInboundReq(res.data);
    
    })
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
const AcceptRequest = event => {
    axios.get("http://localhost:3000/users/friendRequest/accept/" + InboundReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request accepted");
}   

const RejectRequest = event => {
    axios.get("http://localhost:3000/users/friendRequest/reject/" + InboundReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request rejected");
}   

    if(!ThisUser)
    return(
        <div style={friendProfileStyle}>
            <div><h1>This user does not exist</h1></div>
        </div>
    );
    if (!InboundReq.error)
    {
    if (InboundReq.status === 'pending')
    {
    return(
        <div style={friendProfileStyle}>
            <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={ThisUser.avatar} />
            <div><h1>{ThisUser.login}</h1></div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <p>Friend request is {InboundReq.status}</p>
            <button onClick={AcceptRequest}>Accept request?</button>
            <button onClick={RejectRequest}>Reject request?</button>
        </div>
    );
    }
    else if (InboundReq.status === 'rejected')
    {
    return(
        <div style={friendProfileStyle}>
            <img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} src={ThisUser.avatar} />
            <div><h1>{ThisUser.login}</h1></div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <p>Friend request is {InboundReq.status}</p>
        </div>
    );
    }
}
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