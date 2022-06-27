import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";


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

  const {dataFromParent, ...rest} = props;
  const [roomName, setRoomName] = useState(0);
  const canvasRef = useRef(null);
  const [inGame, setInGame] = useState(false);
  const [quit, setQuit] = useState(false);
  const [abort, setAbort] = useState(false);
  const [scoreL, setScoreL] = useState(0);
  const [scoreR, setScoreR] = useState(0);
  const [playerL, setPlayerL] = useState(0);
  const [playerR, setPlayerR] = useState(0);
  const [smach, setSmach] = useState(0);

  let widthExt = 800;
  let heightExt = 600;
  const actualUser = props.dataFromParent;

  // draw when 1 player is on the board 
  const drawWaitingGame = (ctx) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, widthExt, heightExt)
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText("Waiting for an opponent joining the game...", 0, heightExt/2);
  }

//on click, emit to server to ask a matchMaking
 const joinGame = (version) => {
  setSmach(version);
         drawWaitingGame(canvasRef.current.getContext('2d'))
         socket.emit('createGame', actualUser, version);
 }
 const quitGame = () => {
 // drawWaitingGame(canvasRef.current.getContext('2d'))
  socket.emit('abort-match', roomName, scoreL, scoreR);
}
 useEffect(() => {
   console.log('actu user in emit  init', actualUser.id)
   socket.emit('initGame', actualUser.id);
}, [actualUser.id])

//listen permanently if a game starting
  useEffect(() => {
    socket.on("end-match", data => {
      setInGame(false);
    },[]);
   socket.on("restart", data => {
      setQuit(false);
      setAbort(false);
      setInGame(false);
    },[]);
    socket.on("joinroom", data => {
      socket.emit('initGame', actualUser.id);
    },[]);
    socket.on("already-ask", data => {
      drawWaitingGame(canvasRef.current.getContext('2d'))
    },[]);
    socket.on("game-start", data => {
      setRoomName(data.roomname);
      setScoreL(data.sL);
      setScoreR(data.sR);
   //   setRoomName(data.roomname);
      setPlayerL(data.player1);
      setPlayerR(data.player2);
      setQuit(false);
      setAbort(false);
      setInGame(true);
    }, []);
    socket.on("opponent-leave", data => {
      setQuit(true);
     // socket.emit('updateScore', roomName, scoreL, scoreR);
      console.log('apponent-leave', scoreL, scoreR);
    });
    socket.on("opponent-quit", data => {
      setAbort(true);
     // socket.emit('updateScore', roomName, scoreL, scoreR);
    });
  },[actualUser.id, roomName, scoreL, scoreR, heightExt, widthExt])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    var key = 0;
    var height = canvas.height;
    var width = canvas.width;
    console.log('width = ', width, 'height = ', height)
    var posHL = height/2-((height/6)/2);
    var posHR = height/2-((height/6)/2); 
    var ballX = width / 2;
    var ballY = height / 2;
    var ballRadius = height/30;
    var deltaX = -4;
    var deltaY = 4;
 //   var scoreL = 0;
 //   var scoreR = 0;
    var stop = false;
    var sleep = false;
    var winner = '';
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
    const allPos = {
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
      smachY : smachY
    };
    

    if (inGame === false) {
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "60px Verdana";
      context.fillStyle = "white";
      context.fillText("PONG", width/2.5, height/2);
    }

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
  
    socket.on("game-stop", data => {
      winner = data;
      stop = true;
      
    });
  
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
allPos.sleep = data.sleep;
//setScoreR(data.scoreRight);
   //   setScoreL(data.scoreLeft);
  //    console.log(data.y, data.x);
    });
   
    let animationFrameId;
      
    //Our draw came here
    const render = () => {
      if (inGame === true && stop === false && quit === false) {
        if (key === 38)
          socket.emit('moveUp', actualUser.id, roomName, allPos);
        if (key === 40)
          socket.emit('moveDown', actualUser.id, roomName, allPos);
        if (allPos.sleep === false) {
          socket.emit('ball', roomName,  allPos);
        }
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(allPos.scoreL, width/4, height/10);
        context.fillText(allPos.scoreR, width/2 + width/4, height/10);
        context.fillStyle = 'pink';
        context.fillRect(smachX - (height/30)/2, smachY- (height/30)/2, height/30, height/30);
        context.fillStyle = 'red';
        context.fillRect(width - paddleLarge, allPos.posHR, paddleLarge, paddleSize);
        context.fillStyle = 'red';
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
      if (stop === true) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(winner + ' won!', width/3, height/2);
        socket.emit('finish-match', roomName);
      }
      if (quit === true) {
     //   setScoreR(allPos.scoreR);
     // setScoreL(allPos.scoreL);
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText('opponent disconnected...', width/3, height/2);
      socket.emit('updateScore', roomName, allPos.scoreL, allPos.scoreR);
      }
      if (abort === true) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText('a player quit the game...', width/3, height/2);
        socket.emit('finish-match', roomName);
      }
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

    }
  }, [inGame, quit, abort, smach, actualUser.id, roomName, scoreL, scoreR, playerL, playerR])
  
  return (
  <div style={divStyle}>
    <canvas style={canvasStyle} ref={canvasRef} width={widthExt} height={heightExt}  {...rest}/>
    {inGame ? null : <button style={playButton} onClick={() => joinGame(0)}>PLAY PONG</button>}
    {inGame ? null : <button style={playButton} onClick={() => joinGame(1)}>PLAY PONG SMACH</button>}
    {inGame ? <button style={playButton} onClick={quitGame}>QUIT</button> : null}
  </div>
  )
}

export default Game
