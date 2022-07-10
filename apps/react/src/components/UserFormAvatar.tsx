//import axios from "axios";
//import React from "react";
import { useForm } from "react-hook-form";

//-* Formulaire de modif de profil 

//-* Je n'ai pas reussi a faire le formulaire pour la photo, cest un code copie colle quil faut que jadapte avec UserForm, a moins de laisser deux form separes
function UserFormAvatar({user}) {

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
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:3000/users/setimg/" + user.id, {
            method: "POST",
            body: formData,
            credentials: 'include',
        }).then((res) => res.json());
        alert(JSON.stringify(`${res.message}, status: ${res.status}`));
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} />

                <input type="submit" value="send"/>
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