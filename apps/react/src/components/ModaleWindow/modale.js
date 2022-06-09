/* aurel */
import React, {useState} from 'react'

const background = {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9998'
}
const modale = {
    height: '500px',
    width: '700px',
    background: 'rgba(214,105,127)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)'
}

const button = {
    position: 'absolute',
    right: '15px',
    top: '15px'
}
                                                                                                                                                                                                                                                                                              
const Modale = ({revele, cache}) => revele ? (
    <React.Fragment>
        <div style={background} />
        <div style={modale}>
            <button style={button} type='button' onClick={cache}>x</button>
        </div>
    </React.Fragment>
 ) : null;


export default Modale;