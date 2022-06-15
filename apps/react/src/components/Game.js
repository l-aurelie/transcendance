import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const Game = props => {
 
  const [roomName, setRoomName] = useState();
  const canvasRef = useRef(null);
  let begin = 0;
  
  const drawLeftPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(0, 200, 20, 100)
  }

  const drawRightPaddle = rect => {
    rect.fillStyle = 'red'
    rect.fillRect(780, 200, 20, 100)
  }

  const drawBall = ctx => {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(400, 400, 10, 0, 2*Math.PI)
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
  const drawWaitingGame = ctx => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 800, 800)
   
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText("Waiting for an opponent joining the game...", 10, 90);
  }

 
  const handleClick = () => {
    createNewGame();
    //create socket to handle and wait for user
    begin = 1;
  };

  const createNewGame = () => {
    socket.emit('createGame');
  }

  useEffect(() => {
    socket.on("game-start", data => {
      console.log("in game-start, ", data);
      socket.emit('join', data);
      setRoomName(data);
      socket.emit('inWhichRoom', data);
    });
  }, [])
  
  // this.socket.on('initilaisation', this.drawBeginGame);
   useEffect(() => {

  
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.fillStyle = '#000000'
    context.fillRect(0, 0, 800, 800)
    context.font = "50px Verdana";
    context.fillStyle = "white";
    context.fillText("PONG", 300, 400);
    
    // if(begin === 1)
    //   drawBeginGame(context)
    // drawLeftPaddle(context)
    // drawRightPaddle(context)
    // drawBall(context)
   // let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      if(begin === 1) {
        drawWaitingGame(context)
        // console.log('ici;');
        // console.log(socket.id);
        // Permit to create a room in the server-side
       // socket.emit('join', 1);
      }
      else if (begin ===  2)
      {
        drawBeginGame(context)
        socket.emit('join', 1);
      }
     animationFrameId = window.requestAnimationFrame(render)
      
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return (
  <div>
  <canvas ref={canvasRef} width={800} height={800} {...props}/>
  <button onClick={handleClick}>PLAY PONG</button>
  </div>
  )
}

export default Game