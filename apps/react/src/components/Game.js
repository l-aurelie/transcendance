import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const Game = props => {
 
  const [roomName, setRoomName] = useState();
  const [posHL, setPosHL] = useState(200);
  const [posHR, setPosHR] = useState(200);
  const canvasRef = useRef(null);
  let begin = 0;
 
  
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
  (async function() {
     begin = 1;
    })();
    socket.emit('createGame');
  };

/*
  const handleKey = (e) => {
    console.log('handleKey');
    if (e === 'q')
      setPosHL(posHL + 20);
  }
*/  

  useEffect(() => {
    socket.on("game-start", data => {
      console.log("in game-start, ", data);
   
      setRoomName(data);
      begin = 2;

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
    
    // if(begin === 1)
    //   drawBeginGame(context)
    // drawLeftPaddle(context)
    // drawRightPaddle(context)
    // drawBall(context)
   // let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      if(begin === 1)
        drawWaitingGame(context)
      else if (begin ===  2)
        drawBeginGame(context)

     animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   // return () => {
      //window.cancelAnimationFrame(animationFrameId)
    //}
  }, [])
  
  return (
  <div>
  <canvas /*onKeyDown={() => handleKey()}*/ ref={canvasRef} width={800} height={800} {...props}/>
  <button onClick={handleClick}>PLAY PONG</button>
  </div>
  )
}

export default Game