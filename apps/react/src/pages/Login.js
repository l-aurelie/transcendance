import axios from "axios"
import { useEffect } from "react"

const Login = () => {
    /* Ce useEffect sera executee a chaque fois que le composant est monte, il effectue une requete sur nest */ 
    useEffect(() => {
      axios.post("http://localhost:3000/auh/login").then((res) =>{ //axios permet ici de faire une requete get vers un controller de nest (voir nest/src/user/user.controller.ts), il retourne pour l' instant le login de l'utilisateur portant l'id '1', plus tard cela sera change pour obtenir les informations de l'utilisateur connecte
       
      
      })
      
    }, [])
    // return (
    //     <div>
    //         <h1>You are logged in</h1>
    //     </div>
    // );
}

export default Login