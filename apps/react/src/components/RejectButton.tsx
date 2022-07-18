import axios from "axios";
import {socket} from './Socket';

const RejectButton = ({FriendReq, setRefresh}) => {
const RejectRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/reject/" + FriendReq.id, {withCredentials:true}).then((res) => {
    })
    socket.emit('friendrequestnotif', {id: FriendReq.FriendReq.receiverId , new: false});
    alert("Request Rejected");
    setRefresh(true);
}   

return(
<button onClick={RejectRequest}>Reject request</button>
)
}
export default RejectButton