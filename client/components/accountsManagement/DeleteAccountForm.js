import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { renderField } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const DeleteAccountForm = props => {

  const { touch, valid, pristine, submitting, reset, handleSubmit } = props;
  const nameArray = ['email'];

  const resetFormAndSubmit = e => {
    e.preventDefault();
    if (valid) {
      handleSubmit();
    } else {
      touch(...nameArray);
    }
  };

  return (
    <div>

      <form onSubmit={resetFormAndSubmit}>
        <Field name="email" component={renderField} type="email" label="Email" />
        <br/>
        <div className="box-footer">
          <div className="btn-group">
            <button className="btn btn-danger btn-lg btn-hug" type="submit" disabled={pristine || submitting}>Delete</button>
          </div>
        </div>

      </form>
    </div>
  );
};

DeleteAccountForm.propTypes = {
  touch: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'deleteAccount',
  destroyOnUnmount: false,
  validate
})(DeleteAccountForm);
