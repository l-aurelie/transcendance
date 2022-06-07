/*samantha*/
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

/*const VerifyCode = () => {
    const [profil, setProfil] = useState([]); 
    useEffect(() => {
      axios.post("http://localhost:3000/auth/verify").then((res) =>{
        setProfil(res.data);
      })
    }, [])
    return(
      <div>
        <h1>{profil}</h1>
      </div>
    );
  }
*/
  const VerifyCode = (state, isOk) => {
    const [isValid, setValid] = useState([isOk]);
    useEffect(() => {
      axios.post("http://localhost:3000/verify", state, {withCredentials : true })
      .then((response) => {
        if (response.status === 304) {
          console.log('response is 304')
          setValid(false);
        }
        else if (response.status === 200)
        {
          console.log('response is 200');
          setValid(true);
          Navigate("/Home");
          //<Navigate to='/Home'/>;
          //this.render();
        }
      }).catch(e => {console.log('error: ' + e)});
  }, [])
  
  if (isValid)
    return (<Navigate to='/Home'/>);
  else
  {
    return (
    <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom :
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    </div>
    );
  }
}

export default VerifyCode
