/* Manon aurelie */

import Logo from '../components/Logo';
import Game from '../components/Game';
import UserProfil from '../components/UserProfil';
import Chat from '../components/Chat';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {socket} from '../components/Socket';
import SideBarChat from '../components/SideBatChat';


/* Style (insere dans la div jsx) */
const headStyle = {    
	display: 'flex',
	justifyContent: 'flex-end',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: 'lightgrey',
	boxShadow: '0 15px 15px -15px grey',
	zIndex: "10"
} as React.CSSProperties;

const allStyle = {
	display: 'flex',
	justifyContent: 'flex-end',
	borderWidth: '1px',
}

const bodyLogoutStyle = {
	display: 'flex',
	width:"100%",
	// height: "80vh",
	justifyContent:'center',
}
const bodyStyle = {
	display: 'flex',
	width:"100%",
	height: "85vh",
	justifyContent: 'flex-end',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: 'lightgrey',
}

const thankStyle = {
	position:'absolute' as 'absolute',
	top:'50%'
}

const chatStyle = {
	width: "30%",
}

const gameStyle = {
	width: "70%",
	flexDirection: "column", // pour que le bouton soit en dessous du jeu
}

const Home = () => {
   
	const [profil, setProfil] = useState([] as any);
	const [login, setLogin] = useState(false);
	const [charging, setCharging] = useState(true);
	//DECOMMENTER POUR AFFICHER L'AVATAR + deccomment ligne 114
	/*
	const [avatar, setAvatar] = useState([] as any);
	useEffect(() => {        
		axios.get("http://localhost:3000/users/getImg", { withCredentials:true, responseType: "blob" }).then((res) =>{ 
			console.log('getImg()');
			//console.log("type = ", typeof res.data);
			//setAvatar(res.data);
			const blob = res.data;
			const image = URL.createObjectURL(blob);
			setAvatar(image);
			//const imageStream = res.data;
			//const imageBlob =  res.blob();
			//const reader = new FileReader();
			//reader.readAsDataURL(imageBlob);
			//reader.onloadend = () => {
			//const base64data = reader.result;
			//setAvatar(base64data);
			//};
		})
	}, [])*/ 
	
	useEffect(() => {        
	   axios.get("http://localhost:3000/users", { withCredentials:true })
	   .then((res) =>{ 
			setProfil(res.data);
			setCharging(false);
			setLogin(true);
			socket.emit('whoAmI', res.data);
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
			else {
				console.log(error.message);
			}
		})

	socket.on('logout', data => {
		socket.emit('disco');
		setProfil([]);
		setLogin(false);
	});
		socket.on("changeInfos", data => {
		  axios.get("http://localhost:3000/users", {withCredentials:true}).then((res) =>{
		  	setProfil(res.data);  
		  })
		  .catch(error => {
			if (error.response && error.response.status)
			{
				if (error.response.status === 403)
					window.location.href = "http://localhost:4200/";
				else
					console.log("Error: ", error.response.code, " : ", error.response.message);
			}
			else if (error.message)
				console.log(error.message);
			else
				console.log("unknown error");
		})
	});
	}, [])
	if (charging)
	{
		return null;
	}
	else if (login)
	{
		return (
		 <div>
			<div style={headStyle}>
				<Logo></Logo>
				<UserProfil dataFromParent={profil}></UserProfil>
			</div>
			<div style={bodyStyle}>
				<Game style={gameStyle} dataFromParent={profil}/>
				<SideBarChat user={profil}/>
				<Chat style={chatStyle} dataFromParent={profil}></Chat>
			</div>
		</div>
	);
	}
	else
		return (
		<div>
			<div style={allStyle}>
		 		<Logo></Logo>
		 		<UserProfil dataFromParent={profil}></UserProfil>
	 		</div>
	 		<div style={bodyLogoutStyle}>
				<div style={thankStyle}><p><b>Thank you! See you soon !</b></p></div>
			</div>
 		</div>
		);
};

export default Home;

