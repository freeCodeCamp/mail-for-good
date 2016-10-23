import React, { PropTypes } from 'react';
import { Field, reduxForm, initialize } from 'redux-form';
import { Combobox } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

import TextEditor from './CreateCampaignFormTextEditor';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

/*
Helper wrapper functions for react-widgets from the redux-form examples page.

const renderSelectList = ({ input, ...rest }) => <SelectList {...input} onBlur={() => input.onBlur()} {...rest}/>;
const renderDropdownList = ({ input, ...rest }) => <DropdownList {...input} {...rest}/>;
const renderMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    {...rest}/>;
*/

/////////////////////
// Render Wrappers //
/////////////////////

const renderCombobox = ({ input, label, type, meta: { touched, error, warning }, ...data }) => (
  <div>
    <label>{label}</label>
    <div>
      <Combobox {...input} {...data} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input className="form-control" {...input} placeholder={label} type={type}/>
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const renderRadio = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div className="form-group">
      <label><Field component="input" type="radio" {...input} value="Plaintext" /> Plaintext</label>
      <br />
      <label><Field component="input" type="radio" {...input} value="HTML" /> HTML</label>
      <br />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const renderTextEditor = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <Field name="emailBody" component={TextEditor} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

/////////////////////
/////////////////////

///////////////////////////
// Create form component //
///////////////////////////

const CreateCampaignForm = props => {

  const { touch, valid, pristine, submitting, nextPage, reset } = props;

  const lists = props.lists.map(x => x.name);
  const nameArray = ['listName', 'campaignName', 'fromName', 'fromEmail', 'emailSubject', 'emailBody', 'type'];

  const resetFormAndSubmit = (e) => {
    e.preventDefault();
    console.log(props);
    if (valid) {
      nextPage();
    } else {
      touch(...nameArray);
    }
  };

  return (
    <form onSubmit={resetFormAndSubmit}>
      <h3>List and region</h3>
      <div>
        <label>Select a List</label>
        <Field name="listName" component={renderCombobox} data={lists} />
      </div>

      <hr/>

      <h3>Campaign details</h3>
      {/* TODO: This needs to be validated via regex. Doesn't need to be a slug but must resolve to a unique slug so there's no possibility of conflict. */}
      <Field name="campaignName" component={renderField} label="Campaign Name" type="text" />
      <Field name="fromName" component={renderField} label="From Name" type="text" />
      <Field name="fromEmail" component={renderField} label="From Email" type="email" />

      <hr/>

      <h3>Create email</h3>
      <Field name="type" component={renderRadio} label="Type" />
      <Field name="emailSubject" component={renderField} label="Subject" type="text" />
      <Field name="emailBody" component={renderTextEditor} label="Write Email" />

      <br/>
      <div>
        <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Preview</button>
        <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
      </div>
    </form>
  );
};

CreateCampaignForm.propTypes = {
  touch: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  nextPage: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired
};

const validate = values => {
  const errors = {};

  if (!values.listName) {
    errors.listName = 'Required';
  }
  if (!values.campaignName) {
    errors.campaignName = 'Required';
  }
  if (!values.fromName) {
    errors.fromName = 'Required';
  }
  if (!values.fromEmail) {
    errors.fromEmail = 'Required';
  }
  if (!values.emailSubject) {
    errors.emailSubject = 'Required';
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
  form: 'createCampaign',
  destroyOnUnmount: false,
  validate
})(CreateCampaignForm);
