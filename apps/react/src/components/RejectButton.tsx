import axios from "axios";

const RejectButton = ({FriendReq, setRefresh}) => {
const RejectRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/reject/" + FriendReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request Rejected");
    setRefresh(true);
}   

return(
<button onClick={RejectRequest}>Reject request</button>
)
}
export default RejectButton