/* aurel */
import axios from "axios";
import Friends from './friends.jsx'
import { useEffect, useState } from "react";

//TODO: Rendre l'affichage conditionnel (selon si current user) de logout, setProfile
//TODO: Formulaire de modif / d'intialisation des donnees a l'inscription
//TODO: Profil rechecher : addFriend, ecrire un message, defier
//TODO: Ajouter logout bouton ici
//TODO: Ajouter 2fa, victoire, defaire et niveau a la db

/* Composant affichant le profil detaille d'un utilisateur [name] recu en parametre */
const UserProfilExtended = ({name}) => {
    
    const [user, setUser] = useState([]);
    
    useEffect(() => {
        axios.get("http://localhost:3000/users/" + name, {withCredentials:true}).then((res) =>{
        console.log('User profil extended : ', res.data);
        setUser(res.data);
        })
    }, [])
    
    return(
        <div>
            <img style={{maxWidth: '45px', maxHeight: '45px', borderRadius: '100%' }} src={user.avatar} />
            <button>SetProfil</button>
            <div>{user.login}</div>
            <p>[] Victoires</p>
            <p>[] Defaites</p>
            <p>Ligue []</p>
            <div>{user.email}</div>
            <Friends></Friends>
            <div>2fa</div>
            <button>Logout</button>
        </div>
    );
}

export default UserProfilExtended