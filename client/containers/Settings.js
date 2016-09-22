import React from 'react';
import axios from 'axios';
import { SETTINGS_URL_WHOLE } from '../constants/endpoints';

export default class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      newSettings: {
        amazonSimpleEmailServiceAccessKey: '',
        amazonSimpleEmailServiceSecretKey: ''
      }
    };
  }

  handleChange(e) {
    // Preserve the previous settings
    const newSettings = {...this.state.newSettings,
      [e.target.name]: e.target.value
    };

    this.setState({newSettings});
  }

  handleSubmit(e) {
    e.preventDefault();

    axios.post(SETTINGS_URL_WHOLE, this.state.newSettings)
      .then(() => {
        console.log("settings POSTed");
      });
  }

  render() {
    return (
      <div>
        <section className="content-header">
            <h1>Settings <small>Settings page</small></h1>
        </section>
        <section className="content">
          <div className="settings">
            <section className="ses">
              <form onChange={this.handleChange.bind(this)}>
                access key
                <input
                  id="1"
                  type="text"
                  name="amazonSimpleEmailServiceAccessKey"
                  value={this.state.newSettings.amazonSimpleEmailServiceAccessKey} />
                <br/>

                secret key
                <input
                  id="2"
                  type="text"
                  name="amazonSimpleEmailServiceSecretKey"
                  value={this.state.newSettings.amazonSimpleEmailServiceSecretKey} />
                <br/>
                <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
              </form>
            </section>
          </div>
        </section>
      </div>
    );
  }
}
