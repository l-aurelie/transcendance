import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import { useState } from 'react';
import AddNav from './AddNav';
import MaterialIcon from 'material-icons-react';

const SideBarChat = (props) => {

    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/

    return (
        <div style={{backgroundColor: "rgba(238, 229, 229, 0.4)"}}>
            <MaterialIcon icon="add_circle" onClick={toggleModal} />
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <AddNav user={props.user} toggleAddNav={setRevele}/>
            </ModalWindow>
        </div>
    );
};

export default SideBarChat;