/* aurel */
import CSS from 'csstype';
//import { socket } from '../Socket';

const modaleWindow: CSS.Properties = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}

const modaleSide: CSS.Properties = {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'dark',
    width: '250px',
    zIndex: '9999'
  }

const background: CSS.Properties = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const button: CSS.Properties = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}



/* Les fonction Mondal[style] permet d'afficher les elements children sous forme de modale 
** (en fonction de l'etat de du param revele) */
export function ModalWindow({children, revele, setRevele}) {

    if (revele) {
        return (
            <div>
            <div style={background} />
            <div className="modal" style={modaleWindow}>
                <button style={button} onClick={setRevele}>X</button>
                {children}
            </div>
            </div>
        );
    }
    return (
        <></>
    )
}
/* Differentes declinaison style de modale */
export function ModalSide({children, revele, setRevele}) {

    if (revele) {
        return (
            <div className="modal" style={modaleSide}>
                {/*<button onClick={setRevele}>X</button>*/}
                {children}
            </div>
        );
    }
    return (
        <></>
    )
}


/*
export function Component({revele, setRevele}) {

    return (
        <ModalWindow revele={revele} setRevele={setRevele}>
            <h1>ok</h1>
        </ModalWindow>
    );

}

const [revele, setRevele] = useState(false);
const toggleModal = () => {setRevele(!revele);}
return(
        <div>
            <button onClick={toggleModal}>ClickForModal</button>
            <Component revele={revele} setRevele={closeModale}/>
        </div>

    );*/