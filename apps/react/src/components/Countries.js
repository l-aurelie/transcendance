import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cards from './Cards';


/*  
    UseEffects et useState -> ce sont des "hook"
    On cree une cosnt [data, setData] -> pour changer les datas on ne pourra passer que par setData
    'useEffects' se joue lorsque le composant est monte/appele
    '[]' -> call back
    'axios.get' permet d'aller chercher une source de donnees
    On va ensuite mettre les donnees dans une variable [data, setData] = useState([])
*/
const Countries = () => {

    const [data, setData] = useState([])
    const [rangeValue, setRangeValue] = useState(36)
   
    useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
    .then((res) => setData(res.data));
    }, [])

    return (
        <div className='countries'>
            <ul className="radio-container">
            <input 
                type="range" 
                min="1"
                max="250" 
                defaultValue={rangeValue} 
                onChange={(e) => setRangeValue(e.target.value)}
            />
            </ul>
            <ul>
                {data
                .slice(0, rangeValue)
                .map((country, index) => (
                 <Cards key={index} country={country}/>
                ))}
            </ul>
        </div>
    );
};

export default Countries;