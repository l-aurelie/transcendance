import React from "react";

const logo= {
    // fontFamily: arial,
  fontSize: "24px",
  margin: "25px",
  width: "350px",
  height: "200px",
  outline: "dashed", "1px": "black",
  /* Center child horizontally*/
  display : "flex",
  justifyContent: "center"
}

const img= {
 width: "50px",
height: "50px",
  
}

const h3= {
    width: "50px",
    height: "50px",
}

const Logo = () => {
    return (
        <div style={logo}>
            <img style={img} src="./pong.png" alt="logo pong" />
            <h3 style={h3}>Pong World</h3>
        </div>
    )
}
export default Logo