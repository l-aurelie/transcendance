import React, { useEffect, useState } from 'react';
import Logo from './Logo';
//import CreateSalon from './AddChannel';
//import AddNav from './AddNav';
import Select from 'react-select';
import { socket } from "./Socket";
import CSS from 'csstype';
import axios from 'axios';

const log: CSS.Properties = {
    position : 'relative',
    top : '5%',
   // left: '50%'
}

const watchButton: CSS.Properties = {
    position : 'relative',
    top : '40%',
    //left : '10%'
}
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

const button: CSS.Properties = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

  
const AddPrivateMember = ({idRoom, roomName, revele, toggle, toggle2}) => {
    const [allUser, setAllUsers] = useState([]);
    const [members, setMembers] = useState([]);
    useEffect(() => { 
        axios.get("http://localhost:3000/users/allNoMembers/" + idRoom, {withCredentials:true}).then((res) =>{
            let tab = [];
            for (let entry of res.data)
                tab.push({value: entry.id, label:entry.login});
            setAllUsers(tab);
            })
            axios.get("http://localhost:3000/users/members/" + idRoom, {withCredentials:true}).then((res) =>{
            setMembers(res.data)
            console.log('meembers in front', members);   
                })
    
        }, [idRoom, members])
  
    const [option, setOption] = useState(-1);
    const [lab, setLab] = useState("");
    const handleChange = (e) => {
        setOption(e.value);
        setLab(e.label);
    }
    const reset = () => {
        setOption(-1);
        toggle();
        toggle2();
    }


    const add = () => {
        if (option === -1)
            return ;
        else
        {
            socket.emit('user_joins_room', {userId: option, room: roomName, roomId: idRoom});
            let tabU = allUser.filter(element => element.value !== option)
            setAllUsers(tabU);
            let tab = members;
            tab.push({value:option, label:lab});
            setMembers(tab);
            setOption(-1);
            setLab("");
        //    toggle();
        }
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
        <div style={{display:'flex', justifyContent:'space-around', position:"relative",top:"20%"}}>
        <div style={{overflowY:'scroll' as 'scroll', width:'50%', maxHeight:'300px', borderRight:'solid', borderColor:'grey'}}>
            <h2>Members</h2>
                {members.map(data => (<div key={data.value}> {data.label}</div>))}
            
                </div>
        <div style={{width :'50%', top:"50%"}}>

          <div style={{position:"relative",top:"20%"}}>
                    <Select onChange={handleChange} options={allUser}/>
            </div>
            <div style={watchButton}><button  type='button' onClick={add}>Add</button>
            </div>
        </div>
        </div>
        <button style={button} type='button' onClick={reset}>x</button>
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

export default AddPrivateMember;