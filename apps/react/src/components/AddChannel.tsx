/* sam  john aurelie */
import {socket} from './Socket';
import {useState, useEffect} from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import axios from 'axios';

const chatTitle1 = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto", 
    outline: "ridge", "1px": "red",
    //width: "250px",
   // height: "80px",
    borderRadius: "2rem",
    position: "absolute",
    top:"60%", 
    left: "25%",
   } as React.CSSProperties;

   const chatTitle2 = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto", 
    outline: "ridge", "1px": "red",
    //width: "250px",
   // height: "80px",
    borderRadius: "2rem",
    position: "absolute",
    top:"60%", 
    left: "55%",
   } as React.CSSProperties;

const text = {
    position: 'absolute',
    top:'40%',
    left:'36%',
    } as React.CSSProperties;

/* Join des channels, create des channels */
const AddChannel = ({user}) => {
  
    const[message, setMessage] = useState('');
    const [salons, setSalons] = useState([]); //Array de tous les salons a afficher, que l'on peut selectionner
  
    const [reveleAdd, setReveleAdd] = useState(false);
    const toggleAdd = () => {setReveleAdd(!reveleAdd);}

    useEffect(() => {
      socket.on('fetchsalon', data => {
          console.log(data);
            setSalons(data);
       });
      socket.emit('fetchsalon', 'ok');
      }, [])

    const handleChange = event => {
        setMessage(event.target.value);
    };

  const handleClick = (salon) => { 
    axios.get("http://localhost:3000/users/pwd/" + salon.id, {withCredentials: true}).then((res) => {
        console.log('PWD', res.data);
        let goodPwd = false;

        if (res.data === true) {
            
         
           const pwdInput = prompt('Enter the password to join the room');
        //    setPwd(pwdInput);
           const inf = {roomId: salon.id, pwd: pwdInput};
           console.log("PWD === ", pwdInput);
            axios.post("http://localhost:3000/users/checkpwd/", inf, {withCredentials: true}).then((res) => {
                goodPwd = res.data;
                if(!goodPwd)
                alert('Wrong password');
            })
        }
    })
      socket.emit('user_joins_room', {userId: user.id, room: salon.name, roomId:salon.id});
      //toggle();
    };

    const sendNewSalon = (bool, text) => { 
    console.log('user.id = ', user.id);

            socket.emit('addsalon', user.id, bool, false, text);//, actualUser.id);      
            //           toggle();
        };

    return(
        <div>
            <MaterialIcon size="large" icon="group_add" onClick={toggleAdd} />
            <p>Join existing channels</p>    
            {salons.map((salon) => ( 
            <button key={salon.id} onClick={() => handleClick(salon)}>
                <div key={salon.id}>{salon.name}</div>
            </button>))}

            <ModalWindow revele={reveleAdd} setRevele={toggleAdd}>
                <p>Create a new Channel</p>
                <input type='text' id="message" name="message" onChange={handleChange} value={message} style={text}/>
                <button style={chatTitle1} onClick={() => sendNewSalon(false, message)}>Public channel</button>
                <button style={chatTitle2} onClick={() => sendNewSalon(true, message)}>Private channel</button>
            </ModalWindow>
        </div>
    );
}

export default AddChannel