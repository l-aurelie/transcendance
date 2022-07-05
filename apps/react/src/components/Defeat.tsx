import {socket} from './Socket';

const chatTitle1 = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto", 
    outline: "ridge", "1px": "red",
    borderRadius: "2rem",
    position: "absolute",
    top:"70%", 
    left: "38%",
   } as React.CSSProperties;

   const chatTitle2 = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto", 
    outline: "ridge", "1px": "red",
    borderRadius: "2rem",
    position: "absolute",
    top:"70%", 
    left: "52%",
   } as React.CSSProperties;
const Defeat = ( {toggle, opponent, actual, version} ) => {
    console.log('version =', version);
    let v = '';
    if (version === 0)
        v = 'pong';
    else
        v = ' smash pong';
    const accept = () => {
        socket.emit('acceptMatch', opponent, actual, version)
        toggle();
    }

    const reject = () => {
        socket.emit('rejectMatch', opponent, actual, version)
        toggle();
    }

    return(
        
        <div>
        <h1 style={{textAlign:'center'}}>{opponent.login} defeat you to {v}</h1>    
        
        <div style={{textAlign:'center', marginTop:'100px'}}> <img style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt='profilImage' src={opponent.avatar} />
        <b> VS </b><img style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '100%' }} alt='profilImage' src={actual.avatar} />
        </div>
        <button style={chatTitle1} onClick={accept}>Accept</button>
        <button style={chatTitle2} onClick={reject}>Reject</button>
    </div>
        );
};
export default Defeat