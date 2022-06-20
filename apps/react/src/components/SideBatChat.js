import LogiqueModale from "./ModaleWindow/logiqueModale";
import SideBarChatModale from "./ModaleWindow/SideBarChatModale";

const SideBarChat = () => {

    const {revele, toggle} = LogiqueModale();// Outils affichage users apres recherche

    return (
        <div >
            <button onClick={toggle}>&lt;&lt;</button>
            <SideBarChatModale revele={revele} toggle={toggle}/>
        </div>
    );
};

export default SideBarChat;