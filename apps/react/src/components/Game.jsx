import React, { Component } from 'react';
import Box from './Box';
import { BACKGROUND,  BALL, PLAYER } from './Box';


/* taille du tableau de jeu */
const ROW_SIZE = 10;
const COL_SIZE = 21;

/* taille  barre de joueur  
		 _
		|_|		
		|_|
		|_|
*/
const PADDLE_BOARD_SIZE = 3;
const PADDLE_EDGE_SPACE = 1; // espacee de 1 du bord

/* input utilisateur */
const PLAYER_UP   = 38; // up arrow
const PLAYER_DOWN = 40;  // down arrow
const PAUSE       = 32;  // space

/* affichage de tableau 2d
	fr est une unite, chaque case fera 1 fr */
const style = {
	width: "250px",
	heigth: "250px",
	display: "grid",
	gridTemplate: `repeat(${ROW_SIZE}, 1fr) / repeat(${COL_SIZE}, 1fr)`
}

const inner = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "justify",
}

/* Position de la totalite du jeu sur la page */
const outer = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "justify",
	marginTop: "9em",
	marginLeft: "25em",
	Text:"100px",
	padding:"10px"
}

const score = {
	marginLeft: "100px",
	fontSize: "30px",
	color: "white"
}
const scoreop = {
	marginLeft: "50px",
	fontSize: "30px",
	color: "white"
}


const dividerStyle = {
    marginLeft: "50px",
    fontSize: "50px",
    color: "white"
}

const InitialState = () => {
		
	const paddle = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos);
	return {
		/* on cree la barre de jeu
			On a definitle Array(3) => board_size
			et on itere 3x fois pour creer la barre, a partir de la position 
			si x = 0 la barre sera sur le 1,
			et va s'etendre sur trois case x++ sur le 21 et x++ sur le 31*/
		player: paddle.map(x => (x * COL_SIZE) + PADDLE_EDGE_SPACE), // player sera a gauche du tab
		opponent: paddle.map(x => ((x + 1) * COL_SIZE) - (PADDLE_EDGE_SPACE + 1)), // opponent sera a droite du tab
		ball: ((ROW_SIZE * COL_SIZE) / 2) + (ROW_SIZE),  // on positionne la balle au milieu
		ballSpeed: 180,
		deltaY: -COL_SIZE,
		deltaX: -1, // si -1 la balle va vers le player / si 1 elle va vers l'opposant
		pause: true, // pour commencer le jeu
		// /* for dumb AI? */
		opponentSpeed: 150,
		opponentDir: false,
		/* Score */
		playerScore: 0,
		opponentScore: 0, 
	}
}

class Game extends Component {

	constructor(props) {
		super(props);
		this.state = InitialState();
	}

	/*	reset the game 
			quand le jeu est reste on remt la balle au milieu
	*/
	resetGame = () => this.setState({
		ball:((ROW_SIZE * COL_SIZE) / 2) + (ROW_SIZE),
	})

	/* check si on peut bouger le planche du palyer ou de celle de l'opposant
		ca sera basee sur l'input utilisateur, haut ou bas, donc depend du deltaY */
	moveBoard = (playerBoard, isUp) => {
		/* si isUp renvoie une valeur on renvoie le position au plus haut de la barre, sinon on renvoie le bas */
		const playerEdge = isUp ? playerBoard[0] : playerBoard[PADDLE_BOARD_SIZE -1];

		/* si la pos de la barre ne touche pas le bord */
		if(!this.touchingEdge(playerEdge)) {
			const deltaY = (isUp ? -COL_SIZE : COL_SIZE);
			/* Si la balle touche le bord */
			const newDir = (this.state.deltaY !== COL_SIZE ^ isUp) ? -this.state.deltaY : this.state.deltaY;
			
			if (!this.touchingEdge(this.state.ball)) {
				switch (this.state.ball) {
					case playerEdge+deltaY-1:
						this.setState({
							deltaY: newDir,
							deltaX: -1,
						})
						break;
					case playerEdge:
						this.setState({
							deltaY: newDir,
						})
						break;
					case playerEdge+deltaY+1:
						this.setState({
							deltaY: newDir,
							deltaX: 1,
						})
						break;
					default:
						break;
				}
			}
			return playerBoard.map(x => x + deltaY);
		}
		return false
	}
	/* cette fonction est appele immediatement apres que la MAJ ait eu lieu
	Elle permet de travailler sur le DOM une fois que le composant a ete mis a jour */
	componentDidMount() {
		/* on bouge la balle si l'etat actuel n'est pas en pause
			setInterval prend en param la fonction qui bouge la balle si le jeu n'est pas en pause
			et la vitesse de la balle 
			setInterval permet d'actualiser a chaque interval donne , ici la vitesse de la balle
			et ensuite la vitesse du player oppose*/
		setInterval(() => {
			if (!this.state.pause) {
				this.bounceBall();
			}
		}, this.state.ballSpeed);

		/* Bouger l'opposant */
		setInterval(() => {
			if(!this.state.pause) {
				this.moveOpponent();
			}
		}, this.state.opponentSpeed);


		document.onkeydown = this.keyInput;
		document.title = "pong"
	}

	/* check si la balle touche les bords haut et bas du tableau */
	touchingEdge = (pos) => (0 <= pos && pos < COL_SIZE) 
		|| (COL_SIZE * (ROW_SIZE - 1) <= pos && pos < COL_SIZE * ROW_SIZE)


	/* check si la balle touche la barre du joueur -en vertical-
	indexof retournera -1 la position du player ne correspond pas a la 'pos' */
	touchingPaddle = (pos)=> {

		const which = this.state.deltaX === -1 ? "player" : "opponent"
		if ( ( this.state.player.indexOf(pos) !== -1) || (this.state.opponent.indexOf(pos) !== -1) ||
		( which.indexOf(pos + this.state.deltaX) !== -1)) {
			return true
		}
		// if ( ( this.state.player.indexOf(pos) !== -1) {
		// 	console.log('paddle player 1')
		// 	return true
		// }
		// else if  (this.state.opponent.indexOf(pos) !== -1) 
		// {
		// 	console.log('paddle player 2')
		// 	return true

		// }
		
		// else if ( which.indexOf(pos + this.state.deltaX) !== -1) {
		// 		console.log('paddle player 3')
			
		// 		return true
		// }
	}

	/* check si la ball touche le haut ou bas de la barre du jouer -horizontal- */
	touchingPaddleEdge = (pos) => this.state.player[0] === pos ||
		this.state.player[PADDLE_BOARD_SIZE - 1] === pos || 
		this.state.opponent[0] === pos ||
		this.state.opponent[PADDLE_BOARD_SIZE - 1] === pos

	/* check si la balle a marque un point
		si la balle touche les bords gauche et droit sans avoir touche le paddle c'est fini
		si le deltaX est negatif et que la pos %  COL_SIZE = 0 
		(ca veut dire que la balle est au niveau des bords gauche 0 a 180 et inversement 19 a 199 si player gagne)
		la balle va vers le player et donc c'est l'opposant qui gagne */
	isScore = (pos) => (this.state.deltaX === -1 && pos % COL_SIZE === 0) ||
						(this.state.deltaX === 1 && (pos + 1) % COL_SIZE === 0)

	/* pour bouger la barre de l'opposant */
	moveOpponent = () => {
		const movedPlayer = this.moveBoard(this.state.opponent, this.state.opponentDir);
		movedPlayer ? this.setState({opponent: movedPlayer}) :
						this.setState({opponentDir: !this.state.opponentDir});
	} 
	/* fait rebondir la balle
		si la ball touche un des bords bas et haut le delta Y change car la ball doit aller dans la direction inverse
		si la balle touche la barre de joueur c'est le deltaX qui va changer pour les meme raisons*/
	bounceBall = () => {
		/* le nouvel etat de la balle: pos actuelle + deltaX + deltaY */
		const newState = this.state.ball + this.state.deltaX + this.state.deltaY;
		
		/* si ca touche le bord on change le delta Y avec setState */
		if (this.touchingEdge(newState)) {
			this.setState({deltaY: -this.state.deltaY})
			// console.log("touching edge")
		}
		if (this.touchingPaddleEdge(newState)) {
			this.setState({deltaY: -this.state.deltaY})
			// console.log("touching paddleEdge")
		}
		if (this.touchingPaddle(newState)) {
			this.setState({deltaX: -this.state.deltaX})
			// console.log("touching paddle")
		}
		
		/* on update l'etat de la balle */
		this.setState({ball: newState})

		/* on check qui gagne 
			si le deltaX est direction to opponent c'est player qui gagne et inversement*/
		if (this.isScore(newState)) {
			if (this.state.deltaX !== -1) {
				this.setState ({
					playerScore: this.state.playerScore + 1,
					ball: newState,
				})
				// console.log('player won')

			} else {
				this.setState ({
					opponentScore: this.state.opponentScore + 1,
					ball: newState,
				})
				// console.log('opponent won')
			}
			this.setState({pause: true})
			this.resetGame();
		}		
	}

	/* gere les touches pressees par l'utilisateur */
	keyInput = ({keyCode}) => {
	
		switch (keyCode) {
			 	//on fait rien is up vaut rien
			case PLAYER_UP: 
			case PLAYER_DOWN: 
				const movedPlayer = this.moveBoard(this.state.player, keyCode === PLAYER_UP);
				if (movedPlayer) {
					this.setState({player: movedPlayer, pause: false})
				}
				break;
			case PAUSE:
				this.setState({pause: true})
				break;
			default:
			// 	break;


		}
	}

	/* le rendu de tout le code 'mis' sur la page */

	render() {

		//on itere case par case sur le tableau
		const board = [...Array(ROW_SIZE * COL_SIZE)].map((_, pos) => {
			let val = BACKGROUND;
			// indoexOf() renvoie le premier indice pour lequel on trouve un element donne dans le tableau
			// si rien n'est trouve on renvoit -1 donc dans la condition ci dessus , si !== -1 on a trouve la position
			if ((this.state.player.indexOf(pos) !== -1) || (this.state.opponent.indexOf(pos) !== -1)){ 
				val = PLAYER;
			}
			else if (this.state.ball === pos) {
				val = BALL;
			}
			return <Box key={pos} k={pos} name={val} />;

		})
		const divider = [...Array(ROW_SIZE / 2)].map(_=> <div>{"|"}</div>);
		return (
			<div style={outer}>
				<h1>{"Space to pause the game"} {this.state.pause ? "PLAY/pause" : "play/PAUSE"} </h1>
				<div style={inner}>
					{/* on retourne le retour de board a chaque position */}
						<div style={style}>{board}</div>
						<div style={score}>{this.state.playerScore}</div> 
						<div style={dividerStyle}>{divider}</div>
						<div style={scoreop}>{this.state.opponentScore}</div> 
				</div>
			</div>
		);
	}
}

export default Game;