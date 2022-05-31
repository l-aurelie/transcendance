/* Manon */

import React from "react"

/* enum */
const BACKGROUND = 0;
const PLAYER = 1;
const BALL = 2;
export {
    BACKGROUND,
    PLAYER,
    BALL,
}

/* style tableau */ 
const backgroundStyle = {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "black",
    // borderRadius: "2px"
}

const playerStyle = {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "blue",
    color: "white"
}

const ballStyle = {
    height: "35px",
    width: "35px",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color:"white",
    zIndex: "8",
    position: "relative"
}




/* fonction pour savoir quel style on veut */
const getStyle = (val) => {
    if (val === BACKGROUND) {
        return {};
    }
    if (val === PLAYER) {
        return playerStyle;
    }
    else {
        return ballStyle;
    }
}


/* La box sera utilisee pour representer le background, les joueurs et la ball
    en fonction de la position donne par le tableau 
    getStyle permet de recuperer si on veut le stylePlayer ou styleBall*/

const Box = (props) => <div style = {backgroundStyle}>
                     <div style={getStyle(props.name)} /> 
</div>

export default Box
