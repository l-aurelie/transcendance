/* Aurelie John */

import { useState } from "react";
import Logo from "./Logo";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import AddModale from "./ModaleWindow/AddModale";
import MySalons from "./MySalons";

/* SideBarChat : Ajout de channel, display de myChannel/Friends */
const SideBarChatNav = (props) => {

    const {revele, toggle} = LogiqueModale();// Outils affichage modale Add
           
     return (
        <div>
            <Logo />
            <button onClick={toggle}>+ (Add Friend/channel)</button>
            <MySalons />

            {/* Bouton  + acces a l'ajout d'amis et de channels */}  
            <AddModale user={props.user} revele={revele} toggle={toggle}/>
        </div>    
    ); 
 }

 export default SideBarChatNav;
