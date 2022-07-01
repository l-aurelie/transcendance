import LogiqueModale from "./ModaleWindow/logiqueModale";
import AddModale from "./ModaleWindow/AddModale";
import { useEffect, useState } from 'react';

const SideBarChat = (props) => {

    const {revele, toggle} = LogiqueModale();// Outils affichage users apres recherche

    return (
        <div >
            <button onClick={toggle}>+</button>
            <AddModale user={props.user} revele={revele} toggle={toggle}/>
        </div>
    );
};

export default SideBarChat;