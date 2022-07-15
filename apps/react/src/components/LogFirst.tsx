/* aurel */
import axios from "axios";
import React from "react";
import { socket } from "./Socket";

//-* Formulaire de modif de profil 

class UserForm2 extends React.Component<any, any, any> {
    constructor(props: any) {
      super(props);
      //-* Valeurs par defaut
      this.state = {
          id: props.user.id,
          login: props.user.login,
          email: props.user.email,
          twoFA: props.user.twoFA,
          toggle: props.toggle,
          ok: true,
          message:false
        };
 console.log('props 2fa',props.twoFa, this.state.twoFA, "yo");
      //this.fileInput = React.createRef();
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    //-* Gestion des champs controles/chgt des valeur 
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
    //-* Envoie du formulaire 
    async handleSubmit(e) {
      //alert('Le nom a été soumis : ' + this.state.value);
      e.preventDefault();
      //this.setState({ok:true, message:false});
      //let userFormData = new FormData();
      //userFormData.append("avatar", this.fileInput.current.file[0]);
      //userFormData.forEach((value, key) => {
      //console.log("key %s: value %s", key, value.name);})
      //console.log('file selected = ', this.fileInput.current.files[0].name);
      
      //-* Creation de l'obj a envoyer
      const formUser = {
          id: this.state.id,
          login: this.state.login,
          email: this.state.email,
          twoFA: this.state.twoFA,
      }
      axios.post("http://localhost:3000/users/set", formUser, {withCredentials:true}).then((res) =>{
        console.log("form submit"); 
        console.log(res);
        if (res.data === false)
        {
          console.log('enter data === false');
          this.setState({ok:false, message:true})
        }
        else{
          socket.emit('changeInfos', this.state.id);
          this.state.toggle();
        }
      })

      console.log("submit form : ", this.state.login, this.state.email, this.state.twoFA);

      // if (this.state.ok === true)
      // {
      // socket.emit('changeInfos', this.state.id);
      // this.state.toggle();
      // }
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h2>{this.props.user.login}</h2>                  
            </div>
            <div>
                <label>Login :
                <input type="text" value={this.state.login} onChange={this.handleChange} id="login" name="login" /></label>
            </div>
            <input type="submit" value="Set changes" /><b>{this.state.message ? 'log already use...' : ''}</b>

        </form>
      );
    }
  }

  //{/*<input type="file" value={this.state.photo} onChange={this.handleChangePhoto} id="photo" name="photo" /></label>*/}
export default UserForm2