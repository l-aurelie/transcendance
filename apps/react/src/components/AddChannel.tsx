/* sam  john aurelie */
import {socket} from './Socket';
import {useState, useEffect} from 'react';

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
      socket.emit('user_joins_room', {userId: user.id, room: salon.name, dm: false});
      //toggle();
    };

    const sendNewSalon = (bool, text) => {  
            socket.emit('addsalon', user.id, bool, false, text);//, actualUser.id);      
//            toggle();
        };

    return(
        <div>
            <p>Click to join Channels</p>    
            {salons.map((salon) => ( 
            <button onClick={() => handleClick(salon)}>
                <div key={salon.id}>{salon.name}</div>
            </button>))}
            <p>Create a new Channel</p>
            <input type='text' id="message" name="message" onChange={handleChange} value={message} style={text}/>
            <button style={chatTitle1} onClick={() => sendNewSalon(false, message)}>Public channel</button>
            <button style={chatTitle2} onClick={() => sendNewSalon(true, message)}>Private channel</button>
        </div>
    );
}

export default AddChannel