import LogiqueModale from "./ModaleWindow/logiqueModale";
import SideBarChatModale from "./ModaleWindow/SideBarChatModale";

const SideBarChat = (props) => {

    const {revele, toggle} = LogiqueModale();// Outils affichage users apres recherche


    return (
        <div >
            <button onClick={toggle}>&lt;&lt;</button>
            <SideBarChatModale user={props.dataFromParent} revele={revele} toggle={toggle}/>
        </div>
    );
};

export default SideBarChat;