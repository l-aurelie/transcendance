/* sam  john aurelie */
import {socket} from './Socket';
import {useState, useEffect} from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import MaterialIcon from 'material-icons-react';
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
    const[mes, setMes] = useState(false);
    const [currentSal, setCurrentSal] = useState(0); 
    const [currentName, setCurrentName] = useState(0); 
    const [salons, setSalons] = useState([]); //Array de tous les salons a afficher, que l'on peut selectionner
    const [newSalon, setNewSalon] = useState(0); //Array de tous les salons a afficher, que l'on peut selectionner
    const [inf, setInf] = useState('');
    const [reveleAdd, setReveleAdd] = useState(false);
    const toggleAdd = () => {setReveleAdd(!reveleAdd);}
    //const [pwd]
    const [revele, setRevele] = useState(false);
    const toggle = () => {setRevele(!revele);}
    useEffect(() => {
        setNewSalon(0); 
        socket.on('fetchsalon', data => {
        console.log(data);
        setSalons(data);
       });
      socket.emit('fetchsalon', user.id);
      }, [newSalon])

    const handleChange = event => {
        setMessage(event.target.value);
    };

    const check = () => {
        const info = {roomId:currentSal, pwd:inf}
         axios.post("http://localhost:3000/users/checkpwd/", info, {withCredentials: true}).then((res) => {
            if (res.data === true)
            {
              setMes(false);
                socket.emit('user_joins_room', {userId: user.id, room: currentName, roomId:currentSal});

              toggle();
            }
            else{
              setMes(true);
            
            }
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
       // const pwdInput = prompt('Enter the password to join the room');
          //  setPwd(pwdInput);
        //    const inf = {roomId: currentSal, pwd: pwdInput};
        //    console.log("PWD === ", pwdInput);
        //     axios.post("http://localhost:3000/users/checkpwd/", inf, {withCredentials: true}).then((res) => {
        //         goodPwd = res.data;
        //         if(!goodPwd)
        //         alert('Wrong password');
        //     })
    }
  const handleClick = (salon) => { 
    axios.get("http://localhost:3000/users/pwd/" + salon.id, {withCredentials: true}).then((res) => {
        console.log('PWD', res.data);
        //let goodPwd = false;

        if (res.data === true) {
            setCurrentSal(salon.id);
            setCurrentName(salon.name);
            toggle();
        }
        else
            socket.emit('user_joins_room', {userId: user.id, room: salon.name, roomId:salon.id});
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
    
      //toggle();
    };

    const sendNewSalon = (bool, text) => { 
    console.log('user.id = ', user.id);

            socket.emit('addsalon', user.id, bool, false, text);//, actualUser.id); 
            setNewSalon(1);
            setMessage('');
            toggleAdd();     
            //           toggle();
        };
        const handleChange2 = (event) => {    setInf(event.target.value);  }
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
            <ModalWindow revele={revele} setRevele={toggle}>
                <div style={{position:'relative', top:'10%'}}>    
                    <div style={{position:'relative', left:'32%'}}><h2>please enter password</h2></div>
                    <div style={{position:'relative',  left:'38%'}}><input type='password' onChange={(event) =>handleChange2(event)}></input></div>
                    <div style={{position:'relative',  left:'48%'}}><button onClick={check}>Send</button></div>
                    <div style={{position:'relative',  left:'40%'}}><b>{mes ? 'wrong password...' : ''}</b></div>

                </div>
            </ModalWindow>
        </div>
    );
}

export default AddChannel