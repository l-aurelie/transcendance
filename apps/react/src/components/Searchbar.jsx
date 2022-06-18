/*Laura*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/FriendProfileModale.js';

const SearchBar = (props) => {
  const [value, setValue] = useState([]);
  
    const {revele, toggle} = LogiqueModale();

const onChange = (event) => {
  setValue(event.target.value);
}

  return (
    <div className="search bar wrap">
        <div className="search bar">
            <input type = "text" value={value} onChange={onChange} />
            <button onClick={toggle}> Find your friends </button>
              <Modale revele={revele} toggle={toggle} Value={value}/>
        </div> 
      </div>);
  }
  export default SearchBar