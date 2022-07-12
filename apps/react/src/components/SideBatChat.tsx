import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import { useState } from 'react';
import AddNav from './AddNav';
import Logo from './Logo';

const SideBarChat = (props) => {

    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/

    return (
        <div >
            <button onClick={toggleModal}>+</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <Logo />
                {console.log('oh he', props.user)};
                <AddNav user={props.user}/>
            </ModalWindow>
        </div>
    );
};

export default SideBarChat;