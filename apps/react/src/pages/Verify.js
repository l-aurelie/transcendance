/*samantha*/
import axios from 'axios';
import React from 'react';
import {Redirect, Navigate} from "react-router-dom";
import VerifyCode from '../components/VerifyCode';
/*const Verify = () => {
  
  return (
              <VerifyCode></VerifyCode>
     
           // <UserProfil></UserProfil>
          // <Game></Game> 
  );
};

export default Verify;
*/

class Verify extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: '', message: true, ok: false};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    
    handleChange(event) {    this.setState({value: event.target.value});  }
    
    handleSubmit(event) {
      event.preventDefault();
            axios.post("http://localhost:3000/verify", this.state, {withCredentials : true })
          .then((response) => {
            if (response.status === 304) {
              console.log('response is 304')
              this.setState({ok: false, message: false});
            }
            else if (response.status === 200)
            {
              console.log('response is 200');
              this.setState({ok:true});
              //<Navigate to='/Home'/>;
              //this.render();
            }
          })
          .catch(e => {this.setState({ message: false}); console.log('error: ' + e)}) 
          ;//  .finally(() => { 
       // axios.get("http://localhost:3000/users", { withCredentials:true }).then((res) =>{ 
       //     return res.data;
       //  })
       // });
       
      }
  
    render() {
      const {condition} = this.state.ok;
      if (this.state.ok === true)
      {
        console.log('entre ici');
        return (<Navigate to='/Home'/>);
      }
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
        <b>{this.state.message ? '' : 'wrong code, please try again'}</b> 
        </div>
      );
     }
      // <b> {this.state.ok ? '' : 'Wrong code, please try again'} </b>
    }
  }

export default Verify
