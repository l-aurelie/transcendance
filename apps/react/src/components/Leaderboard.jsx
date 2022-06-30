import "./css/matchHistory.css"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ModalWindow } from './ModaleWindow/LogiqueModale2';

const Leaderboard = () => {
    const [leader, setLeader] = useState([]);
    const [revele, setRevele] = useState(false);
    const toggleModal = () => {setRevele(!revele);} 

    useEffect(() => {
        axios.get("http://localhost:3000/stats/getLeaderboard", {withCredentials:true}).then((res) =>{
        setLeader(res.data);
        })
    }, [])
    
    return(
      <div>
            <button onClick={toggleModal}>Leaderboard</button>
            <ModalWindow revele={revele} setRevele={toggleModal}>
            <div classname="my_table">
            <h1>Leaderboard</h1>
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Victories</th>
                </tr>
              </thead>
              <tbody>
            {leader.map(leader => (
            <tr>
            <td><img style={{maxWidth: '40px', maxHeight: '40px', borderRadius: '100%' }} src={leader.avatar}></img>{} {leader.login}</td><td>{leader.total_wins}</td>
            </tr>))}
            </tbody>
            </table>
            </div>
            </ModalWindow>
            </div>
    );
}
export default Leaderboard
