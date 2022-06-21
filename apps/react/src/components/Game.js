import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const divStyle = {
  width:"100%",
  objectFit: "contain",
}

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
  let width = 800;
  let height = 600;
  width= canvasRef.width;
  // height=canvasRef.height;
  let posHL = height/2-((height/6)/2); 
  let posHR = height/2-((height/6)/2); 
  let ballX = width / 2;
  let ballY = height / 2;
  var ballRadius = height/30;
  const rapportWidth = width/400;
  const rapportHeight = height/300;
  const actualUser = props.dataFromParent;

  
  const drawLeftPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(0, posHL, width/30, height/6)
  }

  const drawRightPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(width-(width/30), posHR, width/30, height/6)
  }

  const drawBall = ctx => {
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, 2*Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath();

  }

  // Draw Board with paddle and ball
  const drawBeginGame = ctx => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    
    drawLeftPaddle(ctx)
    drawRightPaddle(ctx)
    drawBall(ctx)
  }

  // draw when 1 player is on the board 
  const drawWaitingGame = (ctx) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = "10px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText("Waiting for an opponent joining the game...", 10, 90);
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
  
    console.log("afetr game-start ? Game = " + inGame)
  
  },)

  useEffect(() => {
    
    if (inGame === false) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "20px Verdana";
      context.fillStyle = "white";
      context.fillText("PONG", width/2, height/2);
    }
    var key = 0;
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
  socket.on("left-move", data => {
    posHL = data * rapportHeight;
  });
  socket.on("right-move", data => {
    posHR = data * rapportHeight;
  });
  socket.on("updatedBall", data => {
    ballX = data.x * rapportWidth;
    ballY = data.y * rapportHeight;
  });
  let animationFrameId;
      
    //Our draw came here
    const render = () => {
      if (inGame === true) {
        if (key === 38)
          socket.emit('moveUp', actualUser.id, roomName);
        if (key === 40)
          socket.emit('moveDown', actualUser.id, roomName);
      socket.emit('ball', roomName,  ballX, ballY);
      drawBeginGame(canvasRef.current.getContext('2d'))
      }
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

    }
  }, [inGame, roomName, rapportHeight, rapportWidth])
  
  return (
  <div >
    <canvas style={canvasStyle} ref={canvasRef}  {...rest}/>
    {inGame ? null : <button style={playButton} onClick={joinGame}>PLAY PONG</button>}
  </div>
  )
}

export default Game
