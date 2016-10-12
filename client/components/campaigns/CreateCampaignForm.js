import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Combobox } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

import TextEditor from './CreateCampaignFormTextEditor';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const renderCombobox = ({ input, ...data }) => <Combobox {...input} {...data} />;

/*
Helper wrapper functions for react-widgets from the redux-form examples page. May be useful later.

const renderSelectList = ({ input, ...rest }) => <SelectList {...input} onBlur={() => input.onBlur()} {...rest}/>;
const renderDropdownList = ({ input, ...rest }) => <DropdownList {...input} {...rest}/>;
const renderMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    {...rest}/>;
*/

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

  return errors;
};

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input className="form-control" {...input} placeholder={label} type={type}/>
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);


const CreateCampaignForm = (props) => {

  const { error, handleSubmit, pristine, reset, submitting } = props;

  const lists = props.lists.map(x => x.name);

  const resetFormAndSubmit = () => {
    handleSubmit();
    reset();
  };

  return (
    <form onSubmit={resetFormAndSubmit}>
      <h3>Select email type, relay server & list</h3>
      <div>
        <label>Select a List</label>
        <Field name="listName" component={renderCombobox} data={lists} />
      </div>

      <hr/>

      <h3>Campaign details</h3>
      <div> {/* TODO: This needs to be validated via regex. Doesn't need to be a slug but must resolve to a unique slug so there's no possibility of conflict. */}
        <Field name="campaignName" component={renderField} label="Campaign Name" type="text" />
      </div>

      <div>
        <Field name="fromName" component={renderField} label="From Name" type="text" />
      </div>

      <div>
        <Field name="fromEmail" component={renderField} label="From Email" type="email" />
      </div>

      <hr/>

      <h3>Create email</h3>
      <div>
        <Field name="emailSubject" component={renderField} label="Subject" type="text" />
      </div>

      <div>
        <label>Write Email</label>
        <Field name="emailBody" component={TextEditor} />
      </div>

      <br/>
      <div>
        <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Create</button>
        <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'createCampaign',
  destroyOnUnmount: false,
  validate
})(CreateCampaignForm);
