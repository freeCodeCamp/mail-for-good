import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { renderField } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const CreateAccountForm = props => {

  const { touch, valid, pristine, submitting, reset, handleSubmit } = props;
  const nameArray = ['email', 'password', 'passwordConfirm','isAdmin'];

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
        <Field name="password" component={renderField} type="password" label="Password" />
        <Field name="passwordConfirm" component={renderField} type="password" label="Confirm password" />
        <Field name="isAdmin" component={renderField} type="checkbox" label="Has admin rights"/>

        <br/>
        <div className="box-footer">
          <div className="btn-group">
            <button className="btn btn-success btn-lg btn-hug" type="submit" disabled={pristine || submitting}>Create</button>
            <button className="btn btn-danger btn-lg btn-hug" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
          </div>
        </div>

      </form>
    </div>
  );
};

CreateAccountForm.propTypes = {
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
  }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.passwordConfirm) {
    errors.passwordConfirm = 'Required';
  }
  if (values.password !== values.passwordConfirm){
    errors.passwordConfirm = 'Password aren\t matching'
  }

  return errors;
};

export default reduxForm({
  form: 'createAccount',
  destroyOnUnmount: false,
  validate
})(CreateAccountForm);
