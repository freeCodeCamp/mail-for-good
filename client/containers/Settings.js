import React from 'react';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

import { changeSettings } from '../actions/settingsActions';

// Ref https://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html#region-select
const regions = ['us-west-2', 'us-east-1', 'eu-west-1'];

function getState(state) {
  return {
    loading: state.settings.loading
  };
}

@connect(getState, {changeSettings})
export default class Settings extends React.Component {

  static propTypes = {
    changeSettings: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool
  }

  constructor() {
    super();

    this.state = {
      newSettings: {
        amazonSimpleEmailServiceAccessKey: '',
        amazonSimpleEmailServiceSecretKey: '',
        region: ''
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

  onDropdownChange(value) {
    const changeState = this.state;
    changeState.newSettings.region = value;
    this.setState(changeState);
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

                <form role="form" ref="form" onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)} autocomplete="off">
                  <div className="box-body">

                    <div className="form-group">
                      <label htmlFor="example">Access Key</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amazonSimpleEmailServiceAccessKey"  // better way to do this?
                        name="amazonSimpleEmailServiceAccessKey"
                        value={this.state.newSettings.amazonSimpleEmailServiceAccessKey}
                        placeholder="Your service access key"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="amazonSimpleEmailServiceSecretKey">Secret Access Key</label>
                      <input
                        type="password"
                        className="form-control"
                        id="amazonSimpleEmailServiceSecretKey"
                        name="amazonSimpleEmailServiceSecretKey"
                        value={this.state.newSettings.amazonSimpleEmailServiceSecretKey}
                        placeholder="Your service secret key"
                      />
                    </div>

                    <div>
                      <label>Amazon Region associated with this email</label>
                      <DropdownList name="region"
                        data={regions}
                        onChange={this.onDropdownChange.bind(this)} />
                    </div>

                  </div>

                  <div className="box-footer">
                    <button type="submit"
                            className="btn btn-primary">
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
