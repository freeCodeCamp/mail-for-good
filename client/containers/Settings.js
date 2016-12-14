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

function getState(state) {
  return {
    loading: state.settings.loading,
    fieldsExist: state.settings.fieldsExist,
    form: state.form.settings
  };
}

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

@reduxForm({ form: 'settings',  destroyOnUnmount: false, validate })
@connect(getState, { getBooleanForAssignedSettings, changeSettings, notify })
export default class Settings extends Component {

  static propTypes = {
    // connect
    getBooleanForAssignedSettings: PropTypes.func.isRequired,
    changeSettings: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    // redux
    form: PropTypes.object, // Not required as it's only created when needed
    loading: PropTypes.bool.isRequired,
    fieldsExist: PropTypes.object.isRequired,
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
    const { valid, changeSettings, touch, form: { values }, reset, notify } = this.props;

    if (valid) {
      const formattedFormValues = { // Format values in alignment with server expectations
        amazonSimpleEmailServiceAccessKey: values.accessKey,
        amazonSimpleEmailServiceSecretKey: values.secretAccessKey,
        region: values.region,
        whiteLabelUrl: values.whiteLabelUrl,
        amazonSimpleQueueServiceUrl: values.queueUrl
      };
      changeSettings(formattedFormValues);
      reset();
      notify({
        message: 'Your settings have been saved!',
        colour: 'green'
      });
    } else {
      const nameArray = ['accessKey', 'secretAccessKey', 'region', 'whiteLabelUrl', 'queueUrl'];
      touch(...nameArray);
    }
  }

  render() {
    const { pristine, submitting, reset } = this.props;

    // Name of server fields are slightly different to the client names
    const {
      amazonSimpleEmailServiceAccessKey,
      amazonSimpleEmailServiceSecretKey,
      amazonSimpleQueueServiceUrl,
      region,
      whiteLabelUrl
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
                </div>

                <form onSubmit={this.resetFormAndSubmit}>
                  <div className="box-body">

                    <Field name="accessKey" component={renderSettingsField} exists={amazonSimpleEmailServiceAccessKey} label="Access Key" type="text" placeholder="Your service access key" />
                    <Field exists={amazonSimpleEmailServiceSecretKey} name="secretAccessKey" component={renderSettingsField} label="Secret Access Key" type="text" placeholder="Your service secret key" />
                    <Field exists={amazonSimpleQueueServiceUrl} name="queueUrl" component={renderSettingsField} label="SQS URL" type="text" placeholder="Your Amazon SQS queue URL for email feedback" />
                    <Field exists={region} name="region" component={renderSettingsDropdownList} data={regions} label="Amazon region associated with this email" />
                    <Field exists={whiteLabelUrl} name="whiteLabelUrl" component={renderSettingsField} label="White Label URL" type="text" placeholder="Your domain" />

                    <br/>
                    <div className="box-footer">
                      <button className="btn btn-success btn-lg pull-left" type="submit" disabled={pristine || submitting}>Submit</button>
                      <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
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
