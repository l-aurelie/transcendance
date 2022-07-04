import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";
import LogiqueModale from "./ModaleWindow/logiqueModale";
import WatchModale from './ModaleWindow/WatchModale';
import axios from 'axios';

/* JS to TS

  j'ai remplace   },[]); par   }); 
  pour tous les socket.on et il n'y avait plus d'erreur. ca a l;air de marcher de la meme facon

*/

const divStyle = {
  width:"80%",
  // objectFit: "contain",
}
const canvasStyle = {
  width:"100%",
  // objectFit: "contain",
}

const playButton = {
  
  width: "70%",
  // objectFit: "contain",
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
  const [endWatch, setEndWatch] = useState(false);
  const [wait, setWait] = useState(false);
  const [scoreL, setScoreL] = useState(0);
  const [scoreR, setScoreR] = useState(0);
  const [playerL, setPlayerL] = useState(0);
  const [playerR, setPlayerR] = useState(0);
  const [smach, setSmach] = useState(0);
  const [winner, setWinner] = useState('');
  const [games, setGames] = useState([]);
  const [watch, setWatch] = useState(false);
  const [quitSentence, setQuitSentence] = useState('a player quit the game...');
  const [watchName, setWatchName] = useState(0);
  const [loginL, setLoginL] = useState('');
  const [loginR, setLoginR] = useState('');

  let widthExt = 800;
  let heightExt = 600;
  const actualUser = props.dataFromParent;

  const watchMatch = () => {
    axios.get("http://localhost:3000/game/currentGame", {withCredentials:true}).then((res) =>{
        const tab = [];
        var det;
        for (let entry of res.data)
        {
          det = {value: entry.id, label : entry.userLeft.login + " vs " + entry.userRight.login};
          tab.push(det)
        }
        setGames(tab);
        });
        toggle();
  }

//on click, emit to server to ask a matchMaking
 const joinGame = (version) => {
      setWait(true);
      setPresentation(false); 
      setInGame(false);
      setAbort(false);
      setWatch(false);
      setEndWatch(false);
      setQuit(false);
      setStop(false);
      socket.emit('createGame', actualUser, version);
 }

 // ask to quit game or queue
 const quitGame = () => {
  setWait(false);
  setPresentation(false); 
  setInGame(false);
  setAbort(true);
  setQuit(false);
  setEndWatch(false);
  setStop(false);
  if (watch === true) {
    setRoomName(0);  
    setWatch(false);
    socket.emit('leave', watchName);
    setQuitSentence('end of visualisation...');
  }
  else {
    setWatch(false);
    socket.emit('abort-match', roomName, scoreL, scoreR, actualUser.id);
  }
}

// a l' ouverture de la page, regarde si le joueur etait en pleine partie avant d' etre deconnecte ou non
 useEffect(() => {
   socket.emit('initGame', actualUser.id);
  }, [actualUser.id])

// if a socket of same player is open and is playing, show the same game
useEffect(() => {
  socket.on("joinroom", data => {
   if (watch === true) {
    setLoginL('');
    setLoginR('');
    socket.emit('leave', watchName);
  }
   socket.emit('initGame', actualUser.id);
    });
    socket.on("leaveroom", data => {
      socket.emit('leave', data);
    });
},[actualUser.id, watch, watchName])

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
    var smachX = -(height/60);
    var smachY = -(height/60);
    if (smach === 1) {
      var smachX = width/2;
      var smachY = height/4;
    }
    else {
      smachX = -(height/60);
      smachY = -(height/60);
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
      setWatch(false);
      setStop(false);
      setEndWatch(false);
      setRoomName(0);
      setWatchName(0);
      setQuitSentence('a player quit the game...');
      setLoginL('');
      setLoginR('');
      });
      
    socket.on("already-ask", data => {
        setWait(true);
        setPresentation(false); 
        setInGame(false);
        setAbort(false);
      setEndWatch(false);
      setQuit(false);
      setStop(false);
      });
  
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
      setEndWatch(false);
      setStop(false);
      });
  
    socket.on("opponent-leave", data => {
        setScoreL(allPos.scoreL);
        setScoreR(allPos.scoreR);
        socket.emit('updateScore', roomName, allPos.scoreL, allPos.scoreR);
        setWait(false);
        setPresentation(false); 
        setInGame(false);
        setAbort(false);
      setEndWatch(false);
      setQuit(true);
      setStop(false);
      });
      
    socket.on("opponent-quit", data => {
      setAbort(true);
      setWait(false);
      setPresentation(false); 
      setInGame(false);
      setQuit(false);
        setEndWatch(false);
        setStop(false);
     });
    socket.on("game-stop", data => {
     setStop(true);
     setWinner(data);
     setWait(false);
     setPresentation(false); 
     setInGame(false);
     setAbort(false);
     setQuit(false);
     setEndWatch(false);
    });  

    socket.on("watch", data => {
      setLoginL(data.loginL);
      setLoginR(data.loginR);
      setWait(false);
      setPresentation(false); 
      setInGame(false);
      setAbort(false);
      setQuit(false);
      setStop(false);
      setWatch(true);
        setEndWatch(false);
        setWatchName(data.watchRoom);
      });
  
      socket.on("end-before-watch", data => {
        setWait(false);
        setPresentation(false); 
        setInGame(false);
        setAbort(false);
        setQuit(false);
        setStop(false);
        setEndWatch(true);
        });
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
    });

//ensemble des condition g'erant les affichages FIXEs (en dehors du jeu donc)
    if (presentation === true) {
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "60px Verdana";
      context.fillStyle = "white";
      context.fillText("PONG", width/2.5, height/2);
    }
    else if (wait === true)
    {
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
      context.fillText(quitSentence, width/3, height/2);
      socket.emit('finish-match', roomName, actualUser.id);
      setRoomName(0);
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
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height);
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText(winner + ' won!', width/3, height/2);
      socket.emit('finish-match', roomName, actualUser.id);
    }
    else if (endWatch === true)
    {
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height);
      context.font = "30px Verdana";
      context.fillStyle = "white";
      context.fillText('match ended during connection...', width/3, height/2);
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
    if (!presentation) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }
   
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
      }
      if ((inGame === true || watch === true)
          && stop === false && endWatch === false && quit === false
          && abort === false && presentation === false && wait === false) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(loginL + ' ' + allPos.scoreL, width/4, height/10);
        context.fillText(loginR + ' ' + allPos.scoreR, width/2 + width/4, height/10);
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
    endWatch, 
    wait,
    watch,
    watchName,
    quitSentence, 
    smach, 
    actualUser.id, 
    roomName, 
    scoreL, 
    scoreR, 
    playerL, 
    playerR,
    loginL,
    loginR,
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
