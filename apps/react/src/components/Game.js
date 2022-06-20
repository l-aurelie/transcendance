import React, { useRef, useEffect, useState} from 'react'
import { socket } from "./Socket";

const divStyle = {
  position: "relative",
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
 
  //console.log("actualUser = ", actualUser.id);
  const {dataFromParent, ...rest} = props;
 // console.log("props = ",props, " ||| ");
  const [roomName, setRoomName] = useState(0);
  const [key, setKey] = useState(0);

  const canvasRef = useRef(null);
  const [inGame, setInGame] = useState(false);
  let width = 800;
  let height = 600;
  let posHL = height/2-((height/6)/2); 
  let posHR = height/2-((height/6)/2); 
  let ballX = width / 2;
  let ballY = height / 2;
  var ballRadius = height/30;
  const rapportWidth = width/400;
  const rapportHeight = height/300;
  var dy = -2;
  var dx = 2;

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
      // drawBeginGame(canvasRef.current.getContext('2d'))
    }, []);
  
    console.log("afetr game-start ? Game = " + inGame)
  
  },)
  
/*
  //listen permanently if a key was pressed
  //if a game is launched, verify the arrow key and emit to the server to inform that there is movment
  useEffect(() => {
    const handleKeyDown = event => {
      if (roomName === 0)
        return ;
      else {
        event.preventDefault();
        setKey(event.keyCode);
      }
    };
    const handleKeyUp = event => {
      setKey(0);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

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
*/

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
    
    const handleKeyDown = (event) => {
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
   
  /*const handleKeyDown = event => {
    if (roomName === 0)
      return ;
    else {
      event.preventDefault();
      setKey(event.keyCode);
    }
  };
  const handleKeyUp = event => {
    setKey(0);
  }
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
*/
    socket.on("left-move", data => {
      posHL = data * rapportHeight;});
    socket.on("right-move", data => {
      posHR = data * rapportHeight;});
      socket.on("updatedBall", data => {
      ballX= data.x * rapportWidth;
      ballY = data.y * rapportHeight;
      });
    let animationFrameId
      
    //Our draw came here
    const render = () => {
      if (inGame === true) {
        
 /* if (key === 38)
    socket.emit('moveUp', actualUser.id, roomName);
  if (key === 40)
    socket.emit('moveDown', actualUser.id, roomName);
   */
       // context.clearRect(0, 0, width, height);
       // drawBall(canvasRef.current.getContext('2d'))
       socket.emit('ball', roomName,  ballX, ballY);
       drawBeginGame(canvasRef.current.getContext('2d'))
      }
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
   return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', handleKeyDown);
    //  document.removeEventListener('keyup', handleKeyUp);
//        document.removeEventListener('keydown', handleKeyDown);

    }
  }, [inGame, roomName, key, rapportHeight, rapportWidth])
  
  return (
  <div style={divStyle}>
    <canvas ref={canvasRef} width={width} height={height} {...rest}/>
    {inGame ? null : <button style={playButton} onClick={joinGame}>PLAY PONG</button>}
  </div>
  )
}

export default Game
