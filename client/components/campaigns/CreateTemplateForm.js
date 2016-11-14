import React, { PropTypes } from 'react';
import { Field, reduxForm} from 'redux-form';
import { renderField, renderTextEditor, renderRadio } from '../common/FormRenderWrappers';
import 'react-widgets/dist/css/react-widgets.css';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const CreateTemplateForm = props => {

  const { touch, valid, pristine, submitting, nextPage, reset, validationFailed } = props;

  const nameArray = ['templateName', 'fromName', 'fromEmail', 'emailSubject', 'emailBody', 'type'];

  const resetFormAndSubmit = (e) => {
    e.preventDefault();
    if (valid) {
      nextPage();
    } else {
      touch(...nameArray);
      validationFailed('Form is invalid, please review fields with errors')
    }
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

      <h3>Create email</h3>
      <Field name="type" component={renderRadio} label="Type" />
      <Field name="emailSubject" component={renderField} label="Subject" type="text" />
      <Field name="emailBody" component={renderTextEditor} label="Write Email*" />
      <br/>
      <div className="box-footer">
        <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Preview</button>
        <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
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
  lists: PropTypes.array.isRequired,
  validationFailed: PropTypes.func.isRequired
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
