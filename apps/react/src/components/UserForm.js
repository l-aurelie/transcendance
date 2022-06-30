/* aurel */
import axios from "axios";
import React from "react";

/* Formulaire de modif de profil */
class UserForm extends React.Component {
    constructor(props) {
      super(props);
      /* Valeurs par defaut */
      this.state = {
          id: props.user.id,
          login: props.user.login,
          email: props.user.email,
          twoFA: props.user.twoFA,
          photo: null
          //photo: props.user.avatar
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    /* Gestion des champs controles/chgt des valeur */
    handleChange(e) {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
          [name]: value
        });
    }
    handleChangePhoto(e) {
        console.log(e.target);
        this.setState({
          photo: e.target.file[-1]
        });
    }
    /* Envoie du formulaire */
    async handleSubmit(e) {
      //alert('Le nom a été soumis : ' + this.state.value);
      e.preventDefault();
      //const userFormData = new FormData();
      //userFormData.forEach((value, key) => {
      //  console.log("key %s: value %s", key, value);})
      
      /* Creation de l'obj a envoyer */
      const formUser = {
          id: this.state.id,
          login: this.state.login,
          email: this.state.email,
          twoFA: this.state.twoFA,
      }
      axios.post("http://localhost:3000/users/set", formUser, {withCredentials:true}).then((res) =>{
        console.log("form submit");  
      })
     // try {
     //   const ret = await axios.get("http://localhost:3000/users/set");
     //   console.log(ret);
     // } catch(error) {
     //   console.log(error);
     // }

      // try {
      //     axios.post("http://localhost:3000/users/set", 
      //       'truc: toto', {headers: {"Content-Type": "application/x-www-form-urlencoded"},}).
      //     then((res)=> { console.log("res submit form: ", res); })
      // } catch(error) {
      //   console.log(error);
      // }
      console.log("submit form : ", this.state.login, this.state.email, this.state.twoFA);
      
      /*this.setState({
        login: '',
        email: '',
        twoFA: false
      });*/
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <div>
                <label>Login :
                <input type="text" value={this.state.login} onChange={this.handleChange} id="login" name="login" /></label>
            </div>
            <div>
                <label>Email :
                <input type="text" value={this.state.email} onChange={this.handleChange} id="email" name="email" /></label>
            </div>
            <div>
                <label>Two-factor Authentication
                <input type="checkbox" value={this.state.twoFA} onChange={this.handleChange} id="twoFa" name="twoFA" /></label>
            </div>
            <div>
                <label>Photo
                <input type="file" value={this.state.photo} onChange={this.handleChangePhoto} id="photo" name="photo" /></label>
            </div>
            <input type="submit" value="Envoyer" />
            {JSON.stringify(this.state)}
        </form>
      );
    }
  }
export default UserForm