//import axios from "axios";
//import React from "react";
import { useForm } from "react-hook-form";
import { socket } from "./Socket";

//-* Formulaire de modif de profil 

//-* Je n'ai pas reussi a faire le formulaire pour la photo, cest un code copie colle quil faut que jadapte avec UserForm, a moins de laisser deux form separes
function UserFormAvatar({user, revele, toggle}) {

     const { register, handleSubmit } = useForm();

/*    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await axios("http://localhost:3000/users/setimg", {
            method: "POST",
            data: formData,
        }).then((res) => {
            console.log("avatar sent");
            });
        //}).then((res) => res.json());
        //alert(JSON.stringify(`${res.message}, status: ${res.status}`));
    };*/

    const onSubmit = async (data) => {
        console.log('submit avatar');
        if (!data.file[0])
            return;
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:3000/users/setimg/" + user.id, {
            method: "POST",
            body: formData,
            credentials: 'include',
            mode: 'cors',
            headers : {
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : 'true',
            }
        }).then((res) => res.json());
       // alert(JSON.stringify(`${res.message}, status: ${res.status}`));
        close();
    };

    const close = () => {
        socket.emit('changeInfos', user.id);
        toggle();
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} /><br></br><br></br>

                <input type="submit" value="Set photo"/>
            </form>
        </div>
    );
}

{/* <form  onSubmit={this.handleSubmit}>
<label>
  Please, check your mail and enter your secret number : <br></br><br></br>
  <input type="text" value={this.state.value} onChange={this.handleChange} />
  </label>
<input type="submit" value="Send" />
</form> */}
export default UserFormAvatar;