/* sam */
import {socket} from './Socket';
import {useState} from 'react';

const chatTitle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto", 
    outline: "ridge", "1px": "red",
    //width: "250px",
   // height: "80px",
    borderRadius: "2rem",
  }

  const text = {
    position: 'absolute',
    top:'40%',
    left:'36%',
    }
const CreateSalon = ({toggle, user}) => {
  
    const[message, setMessage] = useState('');
    const handleChange = event => {
        setMessage(event.target.value);
    };
    const sendNewSalon = (bool, text) => {  
            socket.emit('addsalon', user.id,bool, text);//, actualUser.id);      
            toggle();
        };

    return(
        <div>
        <input type='text' id="message" name="message" onChange={handleChange} value={message} style={text}/>
        <button style={{chatTitle, position: "absolute", top:"60%", left: "25%"}} onClick={() => sendNewSalon(false, message)}>Add a public salon</button>
    <button style={{chatTitle, position: "absolute", top:"60%", left: "55%"}} onClick={() => sendNewSalon(true, message)}>Add a private salon</button>
        </div>
    );
}

export default CreateSalon