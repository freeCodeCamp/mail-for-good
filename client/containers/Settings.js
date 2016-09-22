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
      <div class="content-wrapper">
        <section className="content-header">
          <h1>Settings <small>Settings page</small></h1>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-md-6">

              {/* Start of Amazon SES form box */}
              <div className="box box-primary">
                <div className="box-header with-border">
                  <h3 className="box-title">Amazon SES credentials</h3>
                </div>

                <form role="form" onChange={this.handleChange.bind(this)}>
                  <div className="box-body">
                    <div className="form-group">
                      <label for="example">Access Key</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amazonSimpleEmailServiceAccessKey"  // better way to do this?
                        name="amazonSimpleEmailServiceAccessKey"
                        value={this.state.newSettings.amazonSimpleEmailServiceAccessKey}
                        placeholder="placeholder"
                      />
                    </div>
                    <div className="form-group">
                      <label for="amazonSimpleEmailServiceSecretKey">Secret</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="amazonSimpleEmailServiceSecretKey"
                        name="amazonSimpleEmailServiceSecretKey" 
                        value={this.state.newSettings.amazonSimpleEmailServiceSecretKey}
                        placeholder="placeholder"
                      />
                    </div>
                  </div>

                  <div className="box-footer">
                    <button type="submit"
                            className="btn btn-primary"
                            onClick={this.handleSubmit.bind(this)}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              {/* End of Amazon SES form box */}

              <div className="col-md-6"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
