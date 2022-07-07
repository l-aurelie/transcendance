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
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:3000/users/setimg/" + user.id, {
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
}

export default UserFormAvatar;