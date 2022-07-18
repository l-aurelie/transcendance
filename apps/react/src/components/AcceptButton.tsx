import axios from "axios";
import {socket} from './Socket';

const AcceptButton = (FriendReq) => {
    
const AcceptRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/accept/" + FriendReq.FriendReq.id, {withCredentials:true}).then((res) => {
    })
    socket.emit('friendrequestnotif', {id: FriendReq.FriendReq.receiverId , new: false});
    alert("Request accepted");
}   

return(
<button onClick={AcceptRequest}>Accept request</button>
)
}
export default AcceptButton