/* sam */
import React, { useState } from 'react';
import Logo from '../Logo';
import CreateSalon from '../AddChannel';
import AddNav from '../AddNav';
import Select from 'react-select';
import { socket } from "../Socket";
import CSS from 'csstype';

const log: CSS.Properties = {
    position : 'relative',
    top : '5%',
   // left: '50%'
}
const bar: CSS.Properties = {
    position : 'relative',
    top : '20%'
}
const watchButton: CSS.Properties = {
    position : 'absolute',
    top : '50%',
    left : '50%'
}
/* Assombri l'arriere plan */
const background: CSS.Properties = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const modale: CSS.Properties = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}

const button: CSS.Properties = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}

  
const WatchModale = ({user, revele, toggle, game}) => {
    const [option, setOption] = useState(-1);
    const handleChange = (e) => {
        setOption(e.value);
    }
    const reset = () => {
        setOption(-1);
        toggle();
    }

    const watch = () => {
        if (option === -1)
            return ;
        else
        {
            socket.emit('watch-match', option, user);
            setOption(-1);
            toggle();
        }
    }
    if (revele)
    {
    return(
        <div>
            <div style={background} />
            <div style={modale}>
                <div style={log}>
                    <Logo/>
                </div>
                <div style={bar}>
                    <Select onChange={handleChange} options={game}/>
                </div>
                <div style={watchButton}>
                    <button style={button} type='button' onClick={watch}>watch</button>
                </div>
                <button style={button} type='button' onClick={reset}>x</button>
            </div>
        </div>
    )
}
else
    return null;
};

export default WatchModale;