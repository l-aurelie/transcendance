import axios from "axios";

const AcceptButton = (FriendReq) => {
    
const AcceptRequest = event => {
   
    axios.get("http://localhost:3000/users/friendRequest/accept/" + FriendReq.FriendReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request accepted");
}   

return(
<button onClick={AcceptRequest}>Accept request</button>
)
}
export default AcceptButton