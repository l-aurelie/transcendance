/*LAURA:*/


const MatchHistory = ( data ) => {
    const history = data.history;
    console.log("THE HISTORY", history);
    return(
        <div>
        <h1>Match History</h1>
        {history.map(history => (
        <h3><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.userLeft.avatar}/>   {history.userLeft.login} {history.scoreLeft} - {history.scoreRight} {history.userRight.login}   <img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.userRight.avatar}></img></h3>
        ))}
        </div>
        );
};
export default MatchHistory

/*<div>
        {history.map(history => (
        <p><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.LeftUser.avatar}/>{history.LeftUser.login}{history.scoreLeft} - {history.scoreRight} {history.RightUser.login}<img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.RightUser.avatar}/></p>
        ))}
        </div>*/
