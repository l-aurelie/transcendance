import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import WatchModale from "./ModaleWindow/WatchModale";
import axios from 'axios';

const divStyle = {
  width:"80%",
  objectFit: "contain",
}
const canvasStyle = {
  width:"100%",
  objectFit: "contain",
}

const playButton = {
  
  width: "70%",
  objectFit: "contain",
  fontSize: "20px",
  borderRadius: "5px",
  color: "white",
  backgroundColor: "grey",
  cursor: "pointer",
}

const Game = (props) => {
  const {revele, toggle} = LogiqueModale();
  //variable utilisant useState, qui vont etre update a chaque chanegement d'etat (affichage de depart, attente, jouer, gagnant, opposant deconnecter, abandon de l' opposant)
  //autre variable necessaire et qui ont besoin d' etre update dans le back : scores, winner,...
  const {dataFromParent, ...rest} = props;
  const [roomName, setRoomName] = useState(0);
  const canvasRef = useRef(null);
  const [presentation, setPresentation] = useState(true);
  const [inGame, setInGame] = useState(false);
  const [quit, setQuit] = useState(false);
  const [abort, setAbort] = useState(false);
  const [stop, setStop] = useState(false);
  const [wait, setWait] = useState(false);
  const [scoreL, setScoreL] = useState(0);
  const [scoreR, setScoreR] = useState(0);
  const [playerL, setPlayerL] = useState(0);
  const [playerR, setPlayerR] = useState(0);
  const [smach, setSmach] = useState(0);
  const [winner, setWinner] = useState('');
  const [games, setGames] = useState([]);

  let widthExt = 800;
  let heightExt = 600;
  const actualUser = props.dataFromParent;

  const watchMatch = () => {
    axios.get("http://localhost:3000/game/currentGame", {withCredentials:true}).then((res) =>{
        const tab = [];
        var det;
        console.log('axios ret =', res.data)
        for (let entry of res.data)
        {
          console.log('in boucle')
          det = {value: entry.id, label : entry.userLeft.login + "-" + entry.userRight.login};
          tab.push(det)
        }
        setGames(tab);
        });
        toggle();
        console.log('tab', games)
  }
//on click, emit to server to ask a matchMaking
 const joinGame = (version) => {
      setWait(true);
      setPresentation(false); 
      setInGame(false);
      setAbort(false);
      setQuit(false);
      setStop(false);
      socket.emit('createGame', actualUser, version);
 }

 // ask to quit game or queue
 const quitGame = () => {
      setWait(false);
      setPresentation(false); 
      setInGame(false);
      setAbort(false);
      setQuit(true);
      setStop(false);
      socket.emit('abort-match', roomName, scoreL, scoreR, actualUser.id);
}

// a l' ouverture de la page, regarde si le joueur etait en pleine partie avant d' etre deconnecte ou non
 useEffect(() => {
   socket.emit('initGame', actualUser.id);
  }, [actualUser.id])

// if a socket of same player is open and is playing, show the same game
useEffect(() => {
  socket.on("joinroom", data => {
      socket.emit('initGame', actualUser.id);
    },[]);
},[actualUser.id])

//principal useEffect qui gere l' affichage dans le canvas
  useEffect(() => {

    //variable necessaire aux cvanvas (position paddle, position ball, taille canvas, score...)
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    var key = 0;
    var height = canvas.height;
    var width = canvas.width;
    var posHL = height/2-((height/6)/2);
    var posHR = height/2-((height/6)/2); 
    var ballX = width / 2;
    var ballY = height / 2;
    var ballRadius = height/30;
    var deltaX = -4;
    var deltaY = 4;
    var sleep = false;
    var login = '';
    var paddleSize = height/6;
    var paddleLarge = width/50;
    var playerLeft = playerL;
    var playerRight = playerR;
    if (smach === 1) {
      var smachX = width/2;
      var smachY = height/4;
    }
    else {
      var smachX = -(height/60);
      var smachY = -(height/60);
    }
    const allPos = { //va etre envoye au back a chaque update de la ball et des paddle
      ballRadius: ballRadius,
      width:width, 
      height:height, 
      paddleLarge:paddleLarge, 
      paddleSize:paddleSize, 
      posHL:posHL, 
      posHR:posHR, 
      ballX:ballX, 
      ballY:ballY, 
      scoreL:scoreL, 
      scoreR:scoreR, 
      deltaX:deltaX,
      deltaY:deltaY,
      speed : 1,
      sleep: sleep,
      playerL:playerLeft,
      playerR: playerRight,
      smachX : smachX,
      smachY : smachY,
      login : login,
    };
    
    //ensemble des socket. on, ecoute si un chanegment d' etat du jeu a eu lieu (deconnection, abandon, fin de match)
    socket.on("restart", data => {
      setWait(false);
      setPresentation(true); 
      setInGame(false);
      setAbort(false);
      setQuit(false);
      setStop(false);
      },[]);
      
    socket.on("already-ask", data => {
        setWait(true);
        setPresentation(false); 
        setInGame(false);
        setAbort(false);
        setQuit(false);
        setStop(false);
      },[]);
  
    socket.on("game-start", data => {
        setRoomName(data.roomname);
        setScoreL(data.sL);
        setScoreR(data.sR);
        setPlayerL(data.player1);
        setPlayerR(data.player2);
        setSmach(data.smash);
        setWait(false);
        setPresentation(false);
        setInGame(true);
        setAbort(false);
        setQuit(false);
        setStop(false);
      }, []);
  
    socket.on("opponent-leave", data => {
        setScoreL(allPos.scoreL);
        setScoreR(allPos.scoreR);
        socket.emit('updateScore', roomName, allPos.scoreL, allPos.scoreR);
        setWait(false);
        setPresentation(false); 
        setInGame(false);
        setAbort(false);
        setQuit(true);
        setStop(false);
      }, []);
      
    socket.on("opponent-quit", data => {
        setAbort(true);
        setWait(false);
        setPresentation(false); 
        setInGame(false);
        setQuit(false);
        setStop(false);
     }, []);
  
    //socket.on pour update les positon de ball et paddle
    socket.on("left-move", data => {
      allPos.posHL = data;
    });
    socket.on("right-move", data => {
      allPos.posHR = data;
    });
    socket.on("updatedBall", data => {
      allPos.ballX = data.x;
      allPos.ballY = data.y;
      allPos.deltaX = data.dx;
      allPos.deltaY = data.dy;
      allPos.scoreL = data.scoreLeft;
      allPos.scoreR = data.scoreRight;
      allPos.speed = data.speed;
      allPos.smachX = data.smX;
      allPos.smachY = data.smY;
      allPos.sleep = data.sleep;
      if ((allPos.scoreL >= 11 && allPos.scoreR < allPos.scoreL - 1) ||
        (allPos.scoreR  >= 11 && allPos.scoreL < allPos.scoreR  - 1)) {
          setStop(true);
          setWinner(data.login);
          setWait(false);
          setPresentation(false); 
          setInGame(false);
          setAbort(false);
          setQuit(false);
        }
    });

//ensemble des condition g'erant les affichages FIXEs (en dehors du jeu donc)
    if (presentation === true) {
      console.log('drawPong');
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "60px Verdana";
      context.fillStyle = "white";
      context.fillText("PONG", width/2.5, height/2);
    }
    else if (wait === true)
    {
      console.log('drawwaiting');
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText("Waiting for an opponent joining the game...", 0, height/2);
    }
    else if (abort === true)
    {
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height);
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText('a player quit the game...', width/3, height/2);
      socket.emit('finish-match', roomName, actualUser.id);
    }
    else if ( quit === true)
    {
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height);
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText('opponent disconnected...', width/3, height/2);
    }
    else if (stop === true)
    {
      console.log('in stop end match');
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height);
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText(winner + ' won!', width/3, height/2);
      socket.emit('finish-match', roomName, actualUser.id); 
    }

    //gestiond des appuie de touche pour bouger les paddles
    const handleKeyDown = event => {
      if (roomName === 0)
        return ;
      else {
        event.preventDefault();
        key = event.keyCode;
      }
    };
    const handleKeyUp = event => {
     event.preventDefault();
      key = 0;
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
   
    let animationFrameId;
      
    //Our draw came here
    const render = () => {
      //affichage durant le jeu
      if (inGame === true) {
        if (key === 38)
          socket.emit('moveUp', actualUser.id, roomName, allPos);
        if (key === 40)
          socket.emit('moveDown', actualUser.id, roomName, allPos);
        if (allPos.sleep === false) {
          socket.emit('ball', roomName,  allPos);
        }
        // console.log('drawGame')
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(allPos.scoreL, width/4, height/10);
        context.fillText(allPos.scoreR, width/2 + width/4, height/10);
        context.fillStyle = 'pink';
        context.fillRect(allPos.smachX - (height/30)/2, allPos.smachY- (height/30)/2, height/30, height/30);
        context.fillStyle = '#d6697f';
        context.fillRect(width - paddleLarge, allPos.posHR, paddleLarge, paddleSize);
        context.fillStyle = '#d6697f';
        context.fillRect(0, allPos.posHL, paddleLarge, paddleSize);
        context.beginPath();
        context.arc(allPos.ballX, allPos.ballY, ballRadius, 0, 2*Math.PI);
        context.fillStyle = 'white';
        context.strokeStyle = 'white';
        context.moveTo(width/2, 0);
        context.lineTo(width/2, height);
        context.stroke();
        context.fill();
        context.closePath();
      }
  
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

    }
  }, [
    inGame, 
    quit, 
    abort, 
    stop, 
    presentation, 
    wait, 
    smach, 
    actualUser.id, 
    roomName, 
    scoreL, 
    scoreR, 
    playerL, 
    playerR, 
    winner
  ])
  
  return (
  <div style={divStyle}>
    <canvas style={canvasStyle} ref={canvasRef} width={widthExt} height={heightExt}  {...rest}/>
    {presentation ? <button style={playButton} onClick={() => joinGame(0)}>PLAY PONG</button> : null}
    {presentation ? <button style={playButton} onClick={() => joinGame(1)}>PLAY PONG SMASH</button> : null}
    {presentation ? <button style={playButton} onClick={watchMatch}>WATCH MATCH</button> : null}
    <WatchModale user={actualUser} revele={revele} toggle={toggle} game={games}/>
    {presentation ? null : <button style={playButton} onClick={quitGame}>QUIT</button> }
  </div>
  )
}

export default Game
