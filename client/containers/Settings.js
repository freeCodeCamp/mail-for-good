import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { getBooleanForAssignedSettings, changeSettings } from '../actions/settingsActions';
import { notify } from '../actions/notificationActions';
import { renderSettingsField, renderSettingsDropdownList } from '../components/common/FormRenderWrappers';
import FontAwesome from 'react-fontawesome';
import 'react-widgets/dist/css/react-widgets.css';

// NOTE: At present, the 'password' type of the secretAccessKey field has been removed. This is because it causes browsers to attempt to
// Save the form details as if they were a login. There's no simply solution around this. Should we need this functionality, the best approach
// Is probably to store the input and displayed state separately

const regions = ['us-west-2', 'us-east-1', 'eu-west-1']; // AWS SES regions

function mapStateToProps(state) {
  return {
    loading: state.settings.loading,
    fieldsExist: state.settings.fieldsExist,
    form: state.form.settings,
    status: state.settings.status
  };
}

const mapDispatchToProps = { getBooleanForAssignedSettings, changeSettings, notify };

const validate = values=> {
  // See ref https://docs.aws.amazon.com/IAM/latest/APIReference/API_AccessKey.html
  const errors = {};

  if (values.accessKey) {
    if (values.accessKey.length < 16 || values.accessKey.length > 32) {
      errors.accessKey = 'Your Access Key is too short';
    }
  }

  if (values.secretAccessKey) {
    if (values.secretAccessKey.length < 40) {
      errors.secretAccessKey = "Your Secret Access Key is too short";
    }
    else if (/[0-9a-f]{40}/.test(values.secretAccessKey)) {
      errors.secretAccessKey = "Your Secret Access Key is incorrect";
    }
  }

  if (values.regions) {
    if (~regions.indexOf(values.regions)) {
      errors.secretAccessKey = "This region does not exist";
    }
  }

  return errors;
};

export class SettingsComponent extends Component {

  static propTypes = {
    // connect
    getBooleanForAssignedSettings: PropTypes.func.isRequired,
    changeSettings: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    // redux
    form: PropTypes.object, // Not required as it's only created when needed
    loading: PropTypes.bool.isRequired,
    fieldsExist: PropTypes.object.isRequired,
    status: PropTypes.string,
    // reduxForm
    touch: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.resetFormAndSubmit = this.resetFormAndSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getBooleanForAssignedSettings();
  }

  resetFormAndSubmit(e) {
    e.preventDefault();
    const { valid, changeSettings, touch, form: { values }, reset } = this.props;

    if (valid) {
      const formattedFormValues = { // Format values in alignment with server expectations
        amazonSimpleEmailServiceAccessKey: values.accessKey,
        amazonSimpleEmailServiceSecretKey: values.secretAccessKey,
        region: values.region,
        whiteLabelUrl: values.whiteLabelUrl,
        amazonSimpleQueueServiceUrl: values.queueUrl,
        email: values.email
      };
      changeSettings(formattedFormValues);
      reset();
    } else {
      const nameArray = ['accessKey', 'secretAccessKey', 'region', 'whiteLabelUrl', 'queueUrl', 'email'];
      touch(...nameArray);
    }
  }

  render() {
    const { pristine, submitting, reset } = this.props;

    // Name of server fields are slightly different to the client names
    const {
      amazonSimpleEmailServiceAccessKey,
      amazonSimpleEmailServiceSecretKey,
      // amazonSimpleQueueServiceUrl,
      region,
      whiteLabelUrl,
      email
    } = this.props.fieldsExist;

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
                  <br /><br />
                  {this.props.status &&
                  <div>
                    Error updating credentials: <br /> {this.props.status}
                  </div>
                  }
                </div>

                <form onSubmit={this.resetFormAndSubmit}>
                  <div className="box-body">

                    <Field
                      exists={amazonSimpleEmailServiceAccessKey}
                      name="accessKey"
                      component={renderSettingsField}
                      label="Access Key"
                      type="text"
                      placeholder="Example: AKIAIOSFODNN7EXAMPLE"
                      helpText={<div><a target="_blank" href="https://aws.amazon.com/developers/access-keys/">Find out more about access keys</a></div>}
                    />
                    <Field
                      exists={amazonSimpleEmailServiceSecretKey}
                      name="secretAccessKey"
                      component={renderSettingsField}
                      label="Secret Access Key"
                      type="text"
                      placeholder="Example: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      helpText={<div><a target="_blank" href="https://aws.amazon.com/developers/access-keys/">Find out more about secret access keys</a></div>}
                    />
                    <Field
                      exists={email}
                      name="email"
                      component={renderSettingsField}
                      label="SES email address"
                      type="text"
                      placeholder="Example: mysesemailaddress@gmail.com"
                      helpText={<div>Configure your SES email address <a target="_blank" href="https://aws.amazon.com/developers/access-keys/">here.</a>This is almost always your sending/from email address.</div>}
                    />
                    <Field
                      exists={region}
                      name="region"
                      component={renderSettingsDropdownList}
                      data={regions}
                      label="Amazon region associated with this email"
                      helpText={<div>View your limits for <a target="_blank" href="https://us-west-2.console.aws.amazon.com/ses/home?region=us-west-2#dashboard:">us-west-2</a>, <a target="_blank" href="https://us-east-1.console.aws.amazon.com/ses/home?region=us-east-1#dashboard:">us-east-1</a>, or <a target="_blank" href="https://eu-west-1.console.aws.amazon.com/ses/home?region=eu-west-1#dashboard:">eu-west-1</a></div>}
                    />
                    <Field
                      exists={whiteLabelUrl}
                      name="whiteLabelUrl"
                      component={renderSettingsField}
                      label="White Label URL [optional]"
                      type="text"
                      placeholder="Example: https://email.myorganisation.com"
                      helpText={<div>Display a custom URL for unsubscription and clickthrough tracking links by providing a white label URL (without the trailing backslash). This must be configured beforehand with your DNS hosting service.</div>}
                    />

                    <br/>
                    <div className="box-footer">
                      <div className="btn-group">
                        <button className="btn btn-success btn-lg btn-hug" type="submit" disabled={pristine || submitting}>Submit</button>
                        <button className="btn btn-danger btn-lg btn-hug" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
                      </div>
                    </div>

                  </div>
                </form>

                {this.props.loading &&
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

export default reduxForm({ form: 'settings', destroyOnUnmount: false, validate })(
  connect(mapStateToProps, mapDispatchToProps)(SettingsComponent)
);
