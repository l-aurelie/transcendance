import React from 'react';


/* Permet de recuperer les donnees d'un parent */
const Cards = ({country}) => {
	
	console.log(country.flag);
	return (
		<li className='card'>
		<img src={country.flags.svg} alt={"drapeau " + country.translations.fra.common}/>
		<div className='infos'>
			<h2>{country.translations.fra.common}</h2>
			<h4>{country.capital}</h4>
			<p>Pop. {country.population.toLocaleString()}</p>
			
		</div>
		</li>
	);
};

export default Cards;