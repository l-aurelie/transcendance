import { useForm } from "react-hook-form";
import { socket } from "./Socket";

//-* Formulaire de modif de Avatar 
function UserFormAvatar2({user, toggle}) {

     const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        console.log('submit avatar');
        if (!data.file[0])
            return;
        const formData = new FormData();
        formData.append("file", data.file[0]);

        await fetch("http://localhost:3000/users/setimg/" + user.id, {
            method: "POST",
            body: formData,
            credentials: 'include',
            mode: 'cors',
            headers : {
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : 'true',
            }
        }).then((res) => res.json());
        //alert(JSON.stringify(`${res.message}, status: ${res.status}`));
        close();
    };

    
    const close = () => {
        socket.emit('changeInfos', user.id);
        toggle();
    }

    return (
        <div className="App">
             <div style={{display:'flex', justifyContent:'center'}}>
                <h2><img style={{maxWidth: '60px', maxHeight: '60px', borderRadius: '100%' }} alt='profilImage' src={user.avatar} /></h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} /><br></br><br></br>

                <input type="submit" value="Set photo"/>
            </form>
        </div>
    );
}


export default UserFormAvatar2;