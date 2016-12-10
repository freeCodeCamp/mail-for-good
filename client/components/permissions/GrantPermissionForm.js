import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import 'react-widgets/dist/css/react-widgets.css';

import { renderField, renderRadio } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const GrantPermissionForm = props => {

  const { touch, valid, pristine, submitting, reset, handleSubmit } = props;
  const nameArray = ['listName', 'campaignName', 'fromName'];

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

        <h3>Grant a user permissions:</h3>

        <Field name="trackingPixelEnabled" component={renderField} type="input" />

        <div><label><Field name="trackingPixelEnabled" component="input" type="checkbox" /> Insert tracking pixel</label></div>
        <div><label><Field name="trackLinksEnabled" component="input" type="checkbox" /> Track link clickthroughs</label></div>
        <div><label><Field name="unsubscribeLinkEnabled" component="input" type="checkbox" /> Add unsubscribe link</label></div>

        <br/>
        <div className="box-footer">
          <div className="btn-group">
            <button className="btn btn-success btn-lg" type="submit" disabled={pristine || submitting}>Grant Permission</button>
            <button className="btn btn-danger btn-lg" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
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

  if (!values.listName) {
    errors.listName = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'grantPermission',
  destroyOnUnmount: false,
  validate
})(GrantPermissionForm);
