import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const divStyle = {
  position: "relative",
}

const playButton = {
  position: "absolute",
  right: "0",
  bottom: "0",
  width: "800px",
  fontSize: "20px",
  borderRadius: "5px",
  color: "white",
  backgroundColor: "grey",
  cursor: "pointer",
}

const Game = (props) => {
 
  //console.log("actualUser = ", actualUser.id);
  const {dataFromParent, ...rest} = props;
  console.log("props = ",props, " ||| ");
  const [roomName, setRoomName] = useState(0);
  const canvasRef = useRef(null);
  const [inGame, setInGame] = useState(false);
  let width = 800;
  let height = 800;
  let posHL = 200;
  let posHR = 200;
  let ballX = width/2;
  let ballY = height/2;
  var ballRadius = 10;
  // const ball = {x: width/2, y:  height-30}
  var dy = -width;
  var dx = -1;

  const actualUser = props.dataFromParent;

  
  const drawLeftPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(0, posHL, 20, 100)
  }

  const drawRightPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(780, posHR, 20, 100)
  }

  const drawBall = ctx => {
    // ctx.clearRect(0, 0, 800, 800);
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, 2*Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath();
    if(ballX + dx > width - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;
    }
    if(ballY + dy > height - ballRadius || ballY + dy < ballRadius) {
        dy = -dy;
    }
    ballX += dx;
    ballY += dy;
   
  }

  // Draw Board with paddle and ball
  const drawBeginGame = ctx => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
  
    drawLeftPaddle(ctx)
    drawRightPaddle(ctx)
    // drawBall(ctx)
  }

  // draw when 1 player is on the board 
  const drawWaitingGame = (ctx) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = "30px Verdana";
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
      // drawBeginGame(canvasRef.current.getContext('2d'))
    }, []);
  
    console.log("afetr game-start ? Game = " + inGame)
  
  },)
  

  //listen permanently if a key was pressed
  //if a game is launched, verify the arrow key and emit to the server to inform that there is movment
  useEffect(() => {
    const handleKeyDown = event => {
      if (roomName === 0)
        return ;
      if (event.keyCode === 38)
      {
        event.preventDefault();
        socket.emit('moveUp', actualUser.id, roomName);
      }
      if (event.keyCode === 40)
      {
        event.preventDefault();
        socket.emit('moveDown', actualUser.id, roomName);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actualUser.id, roomName]);


  //listen permanently if server return a movement to execute for left paddle
  useEffect(() => {
    socket.on("left-move", data => {
      console.log('return left move');
      posHL = data;
    //  drawBeginGame(canvasRef.current.getContext('2d'))

  });
  }, [])

  //listen permanently if server return a movement to execute for right paddle
  useEffect(() => {
    socket.on("right-move", data => {
      console.log('return right move');
      posHR = data;
     // drawBeginGame(canvasRef.current.getContext('2d'))
     
    });
  }, [])

  
  useEffect(() => {
    if (inGame === false) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.fillStyle = '#000000'
      context.fillRect(0, 0, width, height)
      context.font = "50px Verdana";
      context.fillStyle = "white";
      context.fillText("PONG", 300, 400);
    }

    let animationFrameId
      
    //Our draw came here
    const render = () => {
      if (inGame === true) {
        // context.clearRect(0, 0, width, height);
       // drawBall(canvasRef.current.getContext('2d'))
       drawBeginGame(canvasRef.current.getContext('2d'))
      
      }
      animationFrameId = window.requestAnimationFrame(render)
    
      
    
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [inGame])
  
  return (
  <div style={divStyle}>
    <canvas ref={canvasRef} width={width} height={height} {...rest}/>
    {inGame ? null : <button style={playButton} onClick={joinGame}>PLAY PONG</button>}
  </div>
  )
}

export default Game
