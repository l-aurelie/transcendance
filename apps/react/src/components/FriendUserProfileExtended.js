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

useEffect(() => {
    console.log("Value", Value);
    axios.get("http://localhost:3000/users/" + Value, {withCredentials:true}).then((res) => { 
        console.log("http://localhost:3000/users/" + Value);
      setThisUser(res.data);
      //ThisUser = res.data;
      console.log("USER", ThisUser);
    })
}, [])
    console.log("IN THE RIGHT FUNCTION");
    //const message = "Send Friend Request";

    const sendFriendRequest = event => {
       
        axios.get("http://localhost:3000/users/FriendRequest/send/" + ThisUser.id, {withCredentials:true}).then((res) => {
        const mess = res.data;
        window.alert("friend request sent");
       
        })
}


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