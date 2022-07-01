/* Manon */


import React from "react";

const logo= {
    display: "flex",
    width:"40%",
    // objectFit: "contain",
    alignItems: "center",
    margin: "auto", 
}

const border = {
    display: "flex",
    // objectFit: "contain",
    // justifyContent: "center",
    margin: "auto", 
    outline: "ridge", "1px": "red",
    width: "40%",
  //  height: "7vh",
    borderRadius: "2rem",
    color: "rgba(192, 28, 113, 0.8)"
}

const img= {
    display: "flex",
    // objectFit: "contain",
    // justifyContent: "center",
    margin: "auto", 
    width: "10%",
   // height: "50%",
}

const h3= {
    display: "flex",
    // objectFit: "contain",
    justifyContent: "center",
    margin: "auto", 
    color: "rgba(237, 55, 102, 0.8)"
}

const Logo = () => {
    return (
        <div style={logo}>
            <div style={border}>
            <img style={img} src="./pong.png" alt="logo pong" />
            <h3 style={h3}>Pong</h3>
            </div>
        </div>
    )
}
export default Logo