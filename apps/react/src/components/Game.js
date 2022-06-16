import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const Game = props => {
 
  const actualUser = props.dataFromParent;
  console.log("actualUser = ", actualUser.id);
  const [roomName, setRoomName] = useState(0);
  const canvasRef = useRef(null);
  const [inGame, setInGame] = useState(false);
  let posHL = 200;
  let posHR = 200;
  let ballX = 400;
  let ballY = 400;

  const drawLeftPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(0, posHL, 20, 100)
  }

  const drawRightPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(780, posHR, 20, 100)
  }

  const drawBall = ctx => {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(ballX, ballY, 10, 0, 2*Math.PI)
    ctx.fill()
  }

  // Draw Board with paddle and ball
  const drawBeginGame = ctx => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 800, 800)
    drawLeftPaddle(ctx)
    drawRightPaddle(ctx)
    drawBall(ctx)
  }

  // draw when 1 player is on the board 
  const drawWaitingGame = (ctx) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 800, 800)
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
      drawBeginGame(canvasRef.current.getContext('2d'))
        setInGame(true);

    });
  }, [])
  
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
      drawBeginGame(canvasRef.current.getContext('2d'))

  });
  }, [])

  //listen permanently if server return a movement to execute for right paddle
  useEffect(() => {
    socket.on("right-move", data => {
      console.log('return right move');
     posHR = data;
     drawBeginGame(canvasRef.current.getContext('2d'))
     
    });
  }, [])

   useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, 800, 800)
    context.font = "50px Verdana";
    context.fillStyle = "white";
    context.fillText("PONG", 300, 400);

    let animationFrameId
    
    //Our draw came here
    const render = () => {

     animationFrameId = window.requestAnimationFrame(render)
        // if(inGame === true)
        //     render le jeu
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return (
  <div>
  <canvas ref={canvasRef} width={800} height={800} {...props}/>
  <button onClick={joinGame}>PLAY PONG</button>
  </div>
  )
}

export default Game
