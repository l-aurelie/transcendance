/*aurelie john*/
//TODO: Mettre le bouton login dans son propre composant ?


import React, { useState } from 'react';

const SearchBar = (props) => {
  const [value, setValue] = useState([]);
  const onChange = (event) => {
    setValue(event.target.value);
}

const clickFunction = event => {
  //DEFINE WHAT TO DO
  //if correct
  //open profile with option to add friend
  //if not correct
  //show box saying incorrect input!
}

  return (
    <div className="search bar wrap">
        <div className="search bar">
            <input type = "text" value={value} onChange={onChange} />
            <button onClick={clickFunction}> Find your friends </button>
        </div> 
      </div>);
  }
  export default SearchBar