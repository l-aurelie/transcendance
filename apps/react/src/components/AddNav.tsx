import { useState } from "react";
import AddFriend from "./AddFriend";
import AddChannel from "./AddChannel";

/* Switch entre AddFriend ou AddChannels */
 const AddNav = (props) => {
    const [reveleFriend, setReveleFriend] = useState(true); //- etat d'affichage fenetre

     const  switchToFriend = () => {
        setReveleFriend(true);
     }

     const  switchToChannel = () => {
        setReveleFriend(false);
     }  

     return (
      <div>
         <br></br><br></br>
         <div style={{display:'flex', justifyContent:'center', width:'100%', background:'rgba(204, 95, 117)'}}>
            <button onClick={switchToFriend}>Friend</button>
            <button onClick={switchToChannel}>Channel</button>
         </div>
         {reveleFriend ? <AddFriend user={props.user} toggleAddNav={props.toggleAddNav}/> : <AddChannel user={props.user} />}
        </div>    
     );  
 }

 export default AddNav;
