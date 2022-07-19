/* Manon */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Error403 from "./pages/Error403";
// import { FC } from "react";


/*	BrowserRouter englobe toute l'app
 	Routes englobe les != routes
	Route permet d'aller chercher la page et l'auto import */
const App = () => {

	return (
	  <BrowserRouter>
	  <Routes>
		 
			<Route path="/" element={<Login></Login>} />
			<Route path="Home" element={<Home></Home>} />
			{/* path="*" fonctionne si l'url ne correpond a rien declare au dessus*/}
			<Route path="*" element={<Error404></Error404>} />
			<Route path="Denied" element={<Error403></Error403>} />
			<Route path="Verify" element={<Verify></Verify>}/>	
	  </Routes>
	  </BrowserRouter>
	 

  )
} 

export default App;