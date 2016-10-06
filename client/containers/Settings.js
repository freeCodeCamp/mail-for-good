import React from 'react';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { changeSettings } from '../actions/settingsActions';


function getState(state) {
  return {
    loading: state.settings.loading
  };
}

@connect(getState, {changeSettings})
export default class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      newSettings: {
        amazonSimpleEmailServiceAccessKey: '',
        amazonSimpleEmailServiceSecretKey: ''
      },
      loading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      loading: newProps.loading
    });
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
    this.props.changeSettings(this.state.newSettings);
  }

  render() {
    return (
      <div>
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
                      <label htmlFor="example">Access Key</label>
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
                      <label htmlFor="amazonSimpleEmailServiceSecretKey">Secret</label>
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
                {this.props.loading &&  // show the loading spinner appropriately
                  <div className="overlay">
                    <FontAwesome name="refresh" spin/>
                </div>}
              </div>
              {/* End of Amazon SES form box */}

              <div className="col-md-6" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Settings.propTypes = {
  changeSettings: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool
};
