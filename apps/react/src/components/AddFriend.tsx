/* aurelie */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {socket} from './Socket';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import FriendUserProfilExtended from './FriendUserProfileExtended';
import MaterialIcon from 'material-icons-react';
import DisplayUser from './DisplayUser';

const lists = {
	overflowY: "scroll" as "scroll"
}

const AddFriend = (props) => {
const onChange = (event) => {
		setValue(event.target.value);
		setUserNotFound(false);
	}

	const [friends, setFriends] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [value, setValue] = useState([]);
	const [userChoose, setUserChoose] = useState([] as any);
	const [userNotFound, setUserNotFound] = useState(false);
	
	/* Outils d'affichage de la modale */
	const [revele, setRevele] = useState(false);
	const toggleModal = () => {setRevele(!revele);}
	/*------*/
	const [reveleAdd, setReveleAdd] = useState(false);
	const toggleAdd = () => {setReveleAdd(!reveleAdd);}


	/*get friendlist*/    
	useEffect(() => {
		axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
			setFriends(res.data);
		})
		.catch(error => {
			if (error.response && error.response.status)
			{
					if (error.response.status === 403)
							window.location.href = "http://localhost:4200/";
					else
							console.log("Error: ", error.response.code, " : ", error.response.message);
			}
			else if (error.request)
					console.log("Unknown error");
			else
					console.log(error.message);
	})

	//-* Get all users
	axios.get("http://localhost:3000/users/all", {withCredentials:true}).then((res) =>{
		setAllUsers(res.data);
	})
	.catch(error => {
		if (error.response && error.response.status)
		{
				if (error.response.status === 403)
						window.location.href = "http://localhost:4200/";
				else
						console.log("Error: ", error.response.code, " : ", error.response.message);
		}
		else if (error.request)
				console.log("Unknown error");
		else
				console.log(error.message);
})

	socket.on("changeFriends", data => {
		axios.get("http://localhost:3000/friends/friendRequest/me/friendlist", {withCredentials:true}).then((res) =>{
			setFriends(res.data);
		})
		.catch(error => {
			if (error.response && error.response.status)
			{
					if (error.response.status === 403)
							window.location.href = "http://localhost:4200/";
					else
							console.log("Error: ", error.response.code, " : ", error.response.message);
			}
			else if (error.request)
					console.log("Unknown error");
			else
					console.log(error.message);
			})
		})
	}, [])

//-* Ferme toutes les modales pour jouer apres une invitation
const togglePlay = () => {
	props.toggleAddNav();
	toggleAdd();
}

	//-* Regarde si l'ami entre en barre de recherche existe 
	const searchFriend = () => {
		const res = allUsers.find(element => value === element.login);
		setValue([]);
		if(res)
		{
			setUserChoose(res);
			toggleModal();
		}
		else 
			setUserNotFound(true);
	}

/* Recherche d'amis a ajouter */
		return(
				<div>
					<MaterialIcon size="large" icon="person_add" onClick={toggleAdd} />
					<div style={lists}>
						{friends.map(friends => (
							<div key={friends.id}><DisplayUser userConnected={props.user} userSelected={friends} isFriend={true} togglePlay={props.toggleAddNav} togglePlay2={props.toggleAddNav}/></div>
						))}   
					</div>
					<ModalWindow revele={reveleAdd} setRevele={toggleAdd}>
						<p>Add new friends</p>
						<div className="search bar">
							<input type = "text" value={value} onChange={onChange} />
							{/*When we click on button it opens the FriendUserProfil*/}
							<button onClick={searchFriend}> Find members </button>
							{ userNotFound === true ? <p style={{display: 'inline'}}>User doesn't exists</p> : <></>}
							<ModalWindow revele={revele} setRevele={toggleModal}>
								<FriendUserProfilExtended Value={userChoose.login}/>
							</ModalWindow>
						</div>

						<div style={lists}>            
						{allUsers.map(users => (
							<div key={users.id}>
							{ !friends.find(element => users.login === element.login) && users.id !== props.user.id ? 
									<DisplayUser userConnected={props.user} userSelected={users} isFriend={false} togglePlay={togglePlay} togglePlay2={togglePlay}/>
							: <></>}
							</div>
						))} 
						</div>

					</ModalWindow>
				</div>
		);
 };

 export default AddFriend;