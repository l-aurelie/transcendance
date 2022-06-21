/* John aurelie */
const imgStyle = {
    height: '45px',
    width: '45px',
    backgroundColor: 'grey',
    borderRadius: '100%'
}

/* WIP : liste de display des amis et myChannels pour pouvoir changer le currentChannel*/
 const MySalons = () => {
    return(
        <div>
            <p>WIP : listes des amis et des channels rejoint, onClick, devient le channel courant de discussion du chat</p>
            {/* PlaceHolder */}
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate | Defeat | Block</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={imgStyle}></div>
                <div>Nom | Spectate  | Profil | Defeat | Block </div>
            </div>

        </div>
    );
 };

 export default MySalons;
