/*LAURA: friend profile part 2*/

import axios from "axios";
import { useEffect, useState } from "react";


const friendProfileStyle = {
    alignItems: 'center',
    justifyContent: 'center',
}

/* Composant affichant le profil detaille d'un utilisateur [login] recu en parametre {value} */
const FriendUserProfilExtended = ({Value}) => {
    
    const [ThisUser, setThisUser] = useState([]);
    const [friends, setFriends] = useState([]);
    const [InboundReq, setInboundReq] = useState([]);
   
useEffect(() => {
    /*get user*/
    axios.get("http://localhost:3000/users/" + Value, {withCredentials:true}).then((res) => { 
      setThisUser(res.data);
    })
    /*get friends list*/
    axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
    setFriends(res.data);
    })
    /*get requests recus par cet utilisateur*/
    axios.get("http://localhost:3000/friends/friendRequest/me/hasSentMe/" + Value, {withCredentials:true}).then((res) =>{
    setInboundReq(res.data);
    
    })
});

/****************************************/
/*ACTION FUNCTIONS: send/accept/reject***/
/****************************************/

    const sendFriendRequest = event => {
        axios.get("http://localhost:3000/friends/friendRequest/send/" + ThisUser.id, {withCredentials:true}).then((res) => {
        const mess = res.data.error;
        /*Si la fonction send a retourne un erreur ?*/
        if (typeof(mess) === 'string')
        {
            const str = JSON.stringify(mess);
            /*affiche l'erreur*/
            alert(str);
        }
        else
        /*sinon, tout s'est bien passe et on affiche le suivant:*/
            alert("Friend request sent");
        })
}

const AcceptRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/accept/" + InboundReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request accepted");
}   

const RejectRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/reject/" + InboundReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request rejected");
}   

/****************************************/
/*ERROR HANDLING/EXCEPTIONS**************/
/****************************************/
    
    /*CAS 1: L'USER N'EXISTE PAS*/
    if(!ThisUser)
    return(
        <div style={friendProfileStyle}>
            <div><h1>This user does not exist</h1></div>
        </div>
    );

    /*CAS 2: ON a deja recu une requete de cet utilisateur*/
    if (!InboundReq.error)
    {
    /*CAS 2: si c'est une requete pending, on retourne avec les options d'accepter/rejeter la requete*/
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
    /*CAS 3: si on a recu une requete de cet utilisateur mais on l'a rejete on affiche ca*/
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
    /*CAS 4: si on est deja amis"*/ 
   var result = friends.map(a => a.login);
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
    /*SI ON RENTRE PAS DANS LES EXCEPTIONS, on affiche le profil d'utilisateur cherche avec l'option pour envoyer une requete d'ami*/
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