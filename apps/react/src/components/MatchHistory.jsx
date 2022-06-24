/*LAURA:*/


const MatchHistory = ( data ) => {
    const history = data.history;
    return(
        <div>
        <h1>Match History</h1>
        {history.map(history => (
        <p>Player ID: {history.playerLeft} {history.scoreLeft} - {history.scoreRight} Player ID: {history.playerRight}</p>
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
