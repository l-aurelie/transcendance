import { useForm } from "react-hook-form";
import { socket } from "./Socket";

//-* Formulaire de modif de Avatar 
function UserFormAvatar({user, toggle}) {

     const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        console.log('submit avatar');
        console.log('file = ', data.file[0]);
        if (!data.file[0])
            return;
        if(data.file[0].name.search('.jpg')  === -1 && data.file[0].name.search('.jpeg')  === -1 && data.file[0].name.search('.png') === -1)
        {
            alert("Please choose jpeg/jpg or pgn format !");
            return;
        }
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} /><br></br><br></br>

                <input type="submit" value="Set photo"/>
            </form>
        </div>
    );
}


export default UserFormAvatar;