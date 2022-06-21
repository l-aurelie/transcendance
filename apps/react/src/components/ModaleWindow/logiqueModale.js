/* aurel */

import { useState } from "react";

 const LogiqueModale = () => {
     const [revele, setRevele] = useState(false); //- etat d'affichage fenetre
     /* Appel a toggle change l'etat d'affichage */
     function toggle() {
         console.log('ft toggle');
         setRevele(!revele);
     }

     return {
         revele,
         toggle                                                                                                                                                                                                                                                                                                          
     }  
 };

 export default LogiqueModale;



 //Changement a venir
 //TODO: aurel, remanier les modales 
/*
export default function TrModal(children, setOpened, opened) {


    if (opened) {
        return (
            <div className="modal">
                <button onClick={() => setOpened((old_opened) => !old_opened)}>X</button>
        {children}
        </div>
    );
    }
    return (
        <></>
    )
}

export function MotherComponent() {


    const [openModal, setOpenModal] = useState(false);

    return (
        <TrModal opened={openModal} setOpened={setOpenModal}>
            <h1>ok</h1>
        </TrModal>
    );

}*/