import React, { useState, useEffect } from 'react';
import LogiqueModale from './ModaleWindow/logiqueModale';
import Modale from './ModaleWindow/FriendProfileModale.js';


const AddFriend = (props) => {
const onChange = (event) => {
    setValue(event.target.value);
  }

  const [value, setValue] = useState([]);
  const {revele, toggle} = LogiqueModale(1);
/* Recherche d'amis a ajouter */

    return(
        <div>
            <p>Search for friends</p>
            <div className="search bar">
            <input type = "text" value={value} onChange={onChange} />
            {/*When we click on button it opens the Modale described in FriendProfileModale.js*/}
            <button onClick={toggle}> Find your friends </button>
              <Modale revele={revele} toggle={toggle} Value={value}/>
        </div> 
        </div>
    );
 };

 export default AddFriend;
