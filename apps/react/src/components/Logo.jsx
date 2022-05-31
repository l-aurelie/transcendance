/* Manon (tests) */


import React from "react";

const logo= {
    display: "flex",
    justifyContent: "center",
    fontSize: "23px",
    
    // outline: "ridge", "1px": "black"
  /* Center child horizontally*/
 
}
const border = {
    display: "flex",
    justifyContent: "center",
    outline: "ridge", "1px": "red",
    width: "250px",
    height: "80px",
    borderRadius: "2rem",
    color: "rgba(192, 28, 113, 0.8)"
}

const img= {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
    width: "50px",
    height: "50px",
}

const h3= {
    display: "flex",
    justifyContent: "center",
    marginLeft : "10px",
    color: "rgba(237, 55, 102, 0.8)"
}

const Logo = () => {
    return (
        <div style={logo}>
            <div style={border}>
            <img style={img} src="./pong.png" alt="logo pong" />
            <h3 style={h3}>Pong World</h3>
            </div>
        </div>
    )
}
export default Logo