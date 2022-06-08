/* aurel */
import React, {useState} from 'react'

const LogiqueModale = () => {
    const [revele, setRevele] = useState(false);
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