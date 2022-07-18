import axios from "axios";
import {socket} from './Socket';

const RejectButton = (FriendReq) => {
const RejectRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/reject/" + FriendReq.FriendReq.id, {withCredentials:true}).then((res) => {
    })
    socket.emit('friendrequestnotif', {id: FriendReq.FriendReq.receiverId , new: false});
    alert("Request Rejected");
}   

return(
<button onClick={RejectRequest}>Reject request</button>
)
}
export default RejectButton