import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import CreateSalon from './AddChannel';
import AddNav from './AddNav';
import Select from 'react-select';
import { socket } from "./Socket";
import CSS from 'csstype';
import axios from 'axios';

const log: CSS.Properties = {
    position : 'relative',
    top : '5%',
   // left: '50%'
}
const bar: CSS.Properties = {
    position : 'absolute',
    top : '20%',
    width:'50%', height:'auto', borderRight:'solid', borderColor:'grey'
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

  
const AddPrivateMember = ({roomId, revele, toggle}) => {
    const [allUser, setAllUsers] = useState([]);
    const [members, setMembers] = useState([]);
    useEffect(() => { 
        axios.get("http://localhost:3000/users/all", {withCredentials:true}).then((res) =>{
            let tab = [];
            for (let entry of res.data)
                tab.push({value: entry.id, label:entry.login});
            setAllUsers(tab);
            })
            axios.get("http://localhost:3000/users/members/" + roomId, {withCredentials:true}).then((res) =>{
            setMembers(res.data)
            console.log('meembers in front', members);   
                })
    
        }, [])
  
    const [option, setOption] = useState(-1);
    const handleChange = (e) => {
        setOption(e.value);
    }
    const reset = () => {
        setOption(-1);
        toggle();
    }
const tab = [{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},
{value:1, label:"nique-ta-race"}, {value:2, label:"connard"}, {value:roomId, label:roomId},]

    const watch = () => {
        if (option === -1)
            return ;
        else
        {
            setOption(-1);
            toggle();
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
            <div style={watchButton}><button  type='button' onClick={watch}>Add</button>
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