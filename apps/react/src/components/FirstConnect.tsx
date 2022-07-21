//import  { useState } from 'react';
import Logo from './Logo';
//import CreateSalon from './AddChannel';
//import AddNav from './AddNav';
//import Select from 'react-select';
//import { socket } from "./Socket";
import CSS from 'csstype';
import axios from 'axios';
//import UserFormAvatar from './UserFormAvatar';
//import UserForm from './UserForm';
import UserForm2 from './LogFirst';
import UserFormAvatar2 from './LogAvtarFirst';

const log: CSS.Properties = {
    position : 'relative',
    top : '5%',
   // left: '50%'
}
// const bar: CSS.Properties = {
//     position : 'absolute',
//     top : '20%',
//     width:'50%', height:'auto', borderRight:'solid', borderColor:'grey'
// }
// const watchButton: CSS.Properties = {
//     position : 'relative',
//     top : '40%',
//     //left : '10%'
// }
/* Assombri l'arriere plan */
const background: CSS.Properties = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const modale: CSS.Properties = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}

// const button: CSS.Properties = {
//     position: 'absolute',
//     right: '15px',
//     top: '15px'
// }

  
const FirstConnect = ({revele, toggle, user}) => {
   // const [allUser, setAllUsers] = useState([]);
   // const [members, setMembers] = useState([]);
    const toggleForm = () => {}
    console.log(revele, '= revele');

    const close = () => {
        const inf = {userId:user.id};
        axios.post("http://localhost:3000/users/firstFalse", inf, {withCredentials:true}).then((res) => {
            toggle();
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
    }

    if (revele)
    {
    return(
        <div>
        <div style={background} />
             <div style={modale}>
             <div style={log}>
                    <Logo/>
                </div>
                <div style={{position:'relative', left:'42%', top:'3%', justifyContent:'center'}}><h1>Welcome!</h1></div>
                <div style={{position:'relative', top:'2%', display:'flex', justifyContent:'space-around'}}>
                <div style={{width:'50%', height:'auto', borderRight:'solid', borderColor:'grey'}}><h2>Change your informations</h2><UserForm2 user={user} toggle={toggleForm}/></div>
                <div style={{}}><h2>Change your photo</h2><UserFormAvatar2 user={user} toggle={toggleForm}/></div>
                </div>
                
        <div style={{position:'absolute', width:'100%', top:'80%', left:'48%', justifyContent:'center'}}><button type='button' onClick={close}>OK</button></div>
        </div>
        </div>
    //     <div>
    //         <div style={background} />
    //         <div style={modale}>
               
    //             <div style={watchButton}>
    //                 <button style={button} type='button' onClick={watch}>watch</button>
    //             </div>
    //             <button style={button} type='button' onClick={reset}>x</button>
    //         </div>
    //     </div>
     )
}
else
    return null;
};

export default FirstConnect;