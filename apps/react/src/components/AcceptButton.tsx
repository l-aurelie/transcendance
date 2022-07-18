import axios from "axios";

const AcceptButton = ({FriendReq, setRefresh}) => {
    
const AcceptRequest = event => {
    axios.get("http://localhost:3000/friends/friendRequest/accept/" + FriendReq.id, {withCredentials:true}).then((res) => {
    })
    alert("Request accepted");
    setRefresh(true);
}   

return(
<button onClick={AcceptRequest}>Accept request</button>
)
}
export default AcceptButton