import "./css/matchHistory.css"

const MatchHistory = ( data ) => {
    const history = data.history;
    return(
        <div classname="my_table">
        <h1>Match History</h1>
        <table>
          <thead>
            <tr>
            
              <th>Player one</th>
              <th>score</th>
              <th>Player two</th>
              <th>Date</th>
             
            </tr>
          </thead>
          <tbody>
        {history.map(history => (
        <tr>
        <td><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.userLeft.avatar}></img>{} {history.userLeft.login}</td><td>{history.scoreLeft} - {history.scoreRight}</td><td><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={history.userRight.avatar}></img>{} {history.userRight.login}</td><td>{history.date}</td>
        </tr>))}
        </tbody>
        </table>
        </div>
        );
};
export default MatchHistory
