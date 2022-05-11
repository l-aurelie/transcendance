import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";


/*	BrowserRouter englobe toute l'app
 	Routes englobe les != routes
	Route permet d'aller chercher la page et l'auto import */

const App = () => {

  return (
	  <BrowserRouter>
	  <Routes>
			<Route path="/" element={<Home></Home>} />
			<Route path="About" element={<About></About>} />
			{/* path="*" fonctionne si l'url ne correpond a rien declare au dessus*/}
			<Route path="*" element={<Error404></Error404>} />		
	  </Routes>
	  </BrowserRouter>
  )
} 

export default App;