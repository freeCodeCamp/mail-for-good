import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { changeSettings } from '../actions/settingsActions';
import { renderField, renderDropdownList } from '../components/common/FormRenderWrappers';
import FontAwesome from 'react-fontawesome';
import 'react-widgets/dist/css/react-widgets.css';

const regions = ['us-west-2', 'us-east-1', 'eu-west-1']; // AWS SES regions

function getState(state) {
  return {
    loading: state.settings.loading,
    form: state.form.settings
  };
}

const validate = values => {
  // See ref https://docs.aws.amazon.com/IAM/latest/APIReference/API_AccessKey.html
  console.log(values);
  const errors = {};

  if (values.accessKey.length < 16 || values.accessKey.length > 32) {
    errors.accessKey = 'Your Access Key is too short';
  }

  if (values.secretAccessKey.length < 40) {
    errors.secretAccessKey = "Your Secret Access Key is too short";
  }
  else if (/[0-9a-f]{40}/.text(values.secretAccessKey)) {
    errors.secretAccessKey = "Your Secret Access Key is incorrect";
  }

  return errors;
};

@reduxForm({ form: 'settings',  destroyOnUnmount: false })
@connect(getState, { changeSettings })
export default class Settings extends Component {

  static propTypes = {
    // connect
    changeSettings: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    form: PropTypes.object, // Not required as it's only created when needed
    // reduxForm
    touch: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
  }

  resetFormAndSubmit(e) {
    const { valid, changeSettings, touch, form, reset } = this.props;

    e.preventDefault();
    if (valid) {
      changeSettings(form.values);
      reset();
    } else {
      const nameArray = ['accessKey', 'secretAccessKey', 'region', 'whiteLabelUrl'];
      touch(...nameArray);
    }
  }

  render() {
    const { pristine, submitting, reset } = this.props;

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

                    <Field name="accessKey" component={renderField} label="Access Key" type="text" placeholder="Your service access key" />
                    <Field name="secretAccessKey" component={renderField} label="Secret Access Key" type="password" placeholder="Your service secret key" />
                    <Field name="region" component={renderDropdownList} data={regions} label="Amazon region associated with this email" />
                    <Field name="whiteLabelUrl" component={renderField} label="White Label URL" type="text" placeholder="Your domain" />

                    <br/>
                    <div className="box-footer">
                      <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Submit</button>
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
