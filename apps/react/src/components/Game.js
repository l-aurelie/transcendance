import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";
/*
const divStyle = {
  width:"100%",
  objectFit: "contain",
}
*/
const canvasStyle = {
  width:"100%",
  objectFit: "contain",
}

const playButton = {
  position: "absolute",
  right: "0",
  bottom: "0",
  width: "480px",
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
 const joinGame = () => {
         drawWaitingGame(canvasRef.current.getContext('2d'))
         socket.emit('createGame', actualUser.id);
 }

//listen permanently if a game starting
  useEffect(() => {
    socket.on("game-start", data => {
      setRoomName(data);
      setInGame(true);
    }, []);
  },)

  useEffect(() => {
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
    var deltaX = 2;
    var deltaY = -2;
    var scoreL = 0;
    var scoreR = 0;
    var stop = false;
    var winner = '';
    var paddleSize = height/6;
    var paddleLarge = width/25;
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
       deltaY:deltaY
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
    });
   
    let animationFrameId;
      
    //Our draw came here
    const render = () => {
      if (inGame === true && stop === false) {
        if (key === 38)
          socket.emit('moveUp', actualUser.id, roomName, allPos);
        if (key === 40)
          socket.emit('moveDown', actualUser.id, roomName, allPos);
        socket.emit('ball', roomName,  allPos);
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(allPos.scoreL, width/4, height/10);
        context.fillText(allPos.scoreR, width/2 + width/4, height/10);
        context.fillStyle = 'red'
        context.fillRect(width-(width/25), allPos.posHR, paddleLarge, paddleSize)
        context.fillStyle = 'red'
        context.fillRect(0, allPos.posHL, paddleLarge, paddleSize)
        context.beginPath()
        context.arc(allPos.ballX, allPos.ballY, ballRadius, 0, 2*Math.PI)
        context.fillStyle = 'white'
        context.strokeStyle = 'white';
        context.moveTo(width/2, 0)
        context.lineTo(width/2, height)
        context.stroke()
        context.fill()
        context.closePath();
      }
      if (stop === true) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#000000'
        context.fillRect(0, 0, width, height);
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.fillText(winner + ' won!', width/3, height/2);
      }
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

    }
  }, [inGame, actualUser.id, roomName])
  
  return (
  <div >
    <canvas style={canvasStyle} ref={canvasRef} width={widthExt} height={heightExt}  {...rest}/>
    {inGame ? null : <button style={playButton} onClick={joinGame}>PLAY</button>}
  </div>
  )
}

export default Game
