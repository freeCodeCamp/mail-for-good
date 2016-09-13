import React from 'react';
import axios from 'axios';
import { SETTINGS_URL_WHOLE } from '../constants/endpoints';

export default class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      accessKey: '',
      secretKey: ''
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    axios.post(SETTINGS_URL_WHOLE, {
      accessKey: this.state.accessKey,
      secretKey: this.state.secretKey
    }).then(() => {
      console.log("settings POSTed");
    });
  }

  render() {
    return (
      <div className="settings">
        <h3>settings</h3>
        <section className="ses">
          <form onChange={this.handleChange.bind(this)}>
            access key
            <input
              id="1"
              type="text"
              name="accessKey"
              value={this.state.accessKey} />
            <br/>
            
            secret key
            <input
              id="2"
              type="text"
              name="secretKey"
              value={this.state.secretKey} />
            <br/>
            <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
          </form>
        </section>
      </div>
    );
  }
}
