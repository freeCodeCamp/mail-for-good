import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { renderField, renderDropdownList } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const GrantPermissionForm = props => {

  const { touch, valid, pristine, submitting, reset, handleSubmit } = props;
  const nameArray = ['email', 'campaigns', 'templates', 'lists'];

  const resetFormAndSubmit = e => {
    e.preventDefault();
    if (valid) {
      handleSubmit();
    } else {
      touch(...nameArray);
    }
  };

  const permissions = ['None', 'Read', 'Write'];

  return (
    <div>

      <form onSubmit={resetFormAndSubmit}>

        <h3>Grant a user permissions:</h3>

        <Field name="email" component={renderField} type="email" label="User's email" />
        <Field name="campaigns" component={renderDropdownList} data={permissions} label="Campaign access" />
        <Field name="templates" component={renderDropdownList} data={permissions} label="Templates access" />
        <Field name="lists" component={renderDropdownList} data={permissions} label="Lists access" />

        <br/>
        <div className="box-footer">
          <div className="btn-group">
            <button className="btn btn-success btn-lg btn-hug" type="submit" disabled={pristine || submitting}>Grant</button>
            <button className="btn btn-danger btn-lg btn-hug" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
          </div>
        </div>

      </form>
    </div>
  );
};

GrantPermissionForm.propTypes = {
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
  if (!values.campaigns) {
    errors.campaigns = 'Required';
  }
  if (!values.templates) {
    errors.templates = 'Required';
  }
  if (!values.lists) {
    errors.lists = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'grantPermission',
  destroyOnUnmount: false,
  validate
})(GrantPermissionForm);
