import axios from "axios";

const RejectButton = (FriendReq) => {
const RejectRequest = event => {
    axios.get("http://localhost:3000/users/friendRequest/reject/" + FriendReq.FriendReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request Rejected");
}   

return(
<button onClick={RejectRequest}>Reject request</button>
)
}
export default RejectButton