/*Laura: TOP LEFT SEARCHBAR*/

import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/FriendProfileModale.js';

const SearchBar = (props) => {
  /*value = l'entree dans la barre de recherche par l'utilisateur*/
  const [value, setValue] = useState([]);
  const {revele, toggle} = LogiqueModale(1);

/*Quand l'utilisateur ajoute de texte/modifie le texte dans la barre de recherche, on met a jour notre variable value*/
const onChange = (event) => {
  setValue(event.target.value);
}

  return (
    <div className="search bar wrap">
        <div className="search bar">
            <input type = "text" value={value} onChange={onChange} />
            {/*When we click on button it opens the Modale described in FriendProfileModale.js*/}
            <button onClick={toggle}> Find your friends </button>
              <Modale revele={revele} toggle={toggle} Value={value}/>
        </div> 
      </div>);
  }
  export default SearchBar