/*samantha*/

class Verify extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {    this.setState({value: event.target.value});  }
    handleSubmit(event) {
    //    const axios = require('axios');
        axios.post("http://localhost:3000/auth/verify", this.state).then((res) =>{
            setProfil(res.data);
          })
      alert('Le nom a été soumis : ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Nom :
            <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    }
  }

export default Verify;