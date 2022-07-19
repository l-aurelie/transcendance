import { ModalWindow } from './ModaleWindow/LogiqueModale2';
import { useState } from 'react';
import AddNav from './AddNav';
import Logo from './Logo';
import MaterialIcon, {colorPalette} from 'material-icons-react';

const SideBarChat = (props) => {

    /* Outils d'affichage de la modale */
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 
    /*------*/

    return (
        <div>
            <MaterialIcon icon="add_circle" onClick={toggleModal} />
            <ModalWindow revele={revele} setRevele={toggleModal}>
                <Logo />
                <AddNav user={props.user} toggleAddNav={setRevele}/>
            </ModalWindow>
        </div>
    );
};

export default SideBarChat;


        //<div {/*style={{backgroundColor: "rgb(238, 229, 229)"}}*/} ></div>