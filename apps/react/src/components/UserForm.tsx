/* aurel */
import axios from "axios";
import React from "react";
import { socket } from "./Socket";
//import { useForm } from "react-hook-form";

//-* Formulaire de modif de profil 


/*function UserForm() {

     const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:3000/users/setimg", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        alert(JSON.stringify(`${res.message}, status: ${res.status}`));
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} />

                <input type="submit" />
            </form>
        </div>
    );
}*/


class UserForm extends React.Component<any, any, any> {
    constructor(props: any) {
      super(props);
      //-* Valeurs par defaut
      this.state = {
          id: props.user.id,
          login: props.user.login,
          email: props.user.email,
          twoFA: props.user.twoFA,
          toggle: props.toggle
        };
 console.log('props 2fa',props.twoFa, this.state.twoFA, "yo");
      //this.fileInput = React.createRef();
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    //-* Gestion des champs controles/chgt des valeur 
    handleChange(e) {
     // console.log('handlechange');
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

      //let userFormData = new FormData();
      //userFormData.append("avatar", this.fileInput.current.file[0]);
      //userFormData.forEach((value, key) => {
      //  console.log("key %s: value %s", key, value.name);})
     // console.log('file selected = ', this.fileInput.current.files[0].name);
      //-* Creation de l'obj a envoyer
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
      
      //this.setState({
      //  login: '',
      //  email: '',
      //  twoFA: false
      //});
      socket.emit('changeInfos', this.state.id);
      this.state.toggle();
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
              { this.state.twoFA === false ? <input type="checkbox"  value={this.state.twoFA} onChange={this.handleChange} id="twoFa" name="twoFA"/> : <input type="checkbox"  value={this.state.twoFA} onChange={this.handleChange} id="twoFa" name="twoFA" checked/>}
                <label>Two-factor Authentication
                </label>
            </div><br></br>
            {/* <div>
                <label>Photo
                
                <input type="file" ref={this.fileInput} /></label>
            </div> */}
            <input type="submit" value="Set changes" />
            {/* {JSON.stringify(this.state)} */}
        </form>
      );
    }
  }

  //{/*<input type="file" value={this.state.photo} onChange={this.handleChangePhoto} id="photo" name="photo" /></label>*/}
export default UserForm