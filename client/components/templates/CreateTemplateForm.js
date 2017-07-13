import React, { PropTypes } from 'react';
import { Field, reduxForm} from 'redux-form';
import { renderField, renderTextEditor, renderEditorTypeRadio } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const CreateTemplateForm = props => {

  const {
    touch,
    valid,
    pristine,
    submitting,
    nextPage,
    reset,
    validationFailed,
    textEditorType,
    passResetToState,
  } = props;

  const nameArray = [
    'templateName',
    'fromName',
    'fromEmail',
    'emailSubject',
    'emailBody',
    'type',
    'trackingPixelEnabled',
    'trackLinksEnabled',
    'unsubscribeLinkEnabled'
  ];

  const resetFormAndSubmit = (e) => {
    e.preventDefault();
    if (valid) {
      passResetToState(reset);
      nextPage();
    } else {
      touch(...nameArray);
      validationFailed('Form is invalid, please review fields with errors');
    }
  };

  const resetForm = () => {
    reset();
  };

  return (
    <form onSubmit={resetFormAndSubmit}>

      <h3>Template details</h3>
      <Field name="templateName" component={renderField} label="Template Name*" type="text" />
      <hr/>

      <h3>Campaign details</h3>
      <Field name="fromName" component={renderField} label="From Name" type="text" />
      <Field name="fromEmail" component={renderField} label="From Email" type="email" />
      <hr/>

      <h3>Analytics</h3>
      <div><label><Field disabled={textEditorType == 'Plaintext'} name="trackingPixelEnabled" component="input" type="checkbox" /> Insert tracking pixel. Available for HTML emails only.</label></div>
      <div><label><Field disabled={textEditorType == 'Plaintext'} name="trackLinksEnabled" component="input" type="checkbox" /> Track link clickthroughs, syntax: {`{linklabel/http://mylinktotrack.com}`}. Available for HTML emails only. </label></div>
      <div><label><Field name="unsubscribeLinkEnabled" component="input" type="checkbox" /> Add unsubscribe link</label></div><hr/>

      <h3>Create email</h3>
      <Field name="type" component={renderEditorTypeRadio} label="Type" />
      <Field name="emailSubject" component={renderField} label="Subject" type="text" />
      <Field name="emailBody" component={renderTextEditor} label="Write Email*" textEditorType={textEditorType} />
      <br/>
      <div className="box-footer">
        <div className="btn-group">
          <button className="btn btn-success btn-lg btn-hug" type="submit" disabled={pristine || submitting}>Next Step</button>
          <button className="btn btn-danger btn-lg btn-hug" type="button" disabled={pristine || submitting} onClick={resetForm}>Reset</button>
        </div>
      </div>
    </form>
  );
};

CreateTemplateForm.propTypes = {
  touch: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  nextPage: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  validationFailed: PropTypes.func.isRequired,
  textEditorType: PropTypes.string.isRequired,
  passResetToState: PropTypes.func.isRequired,
};

const validate = values => {
  const errors = {};

  if (!values.templateName) {
    errors.templateName = 'Required';
  }
  if (!values.emailBody) {
    errors.emailBody = 'Required';
  }
  if (!values.type) {
    errors.type = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'createTemplate',
  destroyOnUnmount: false,
  validate
})(CreateTemplateForm);
