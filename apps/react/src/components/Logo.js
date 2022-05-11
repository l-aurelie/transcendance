import React from 'react';

const Logo = () => {
    return (
    <div className="logo"> 
    {/* Les images importees depuis la balise img sont accessible dans public */}
        <img src="./ball.png" alt="logo pong" />
        <h3>Pong World</h3>
    </div>
    );
};

export default Logo;