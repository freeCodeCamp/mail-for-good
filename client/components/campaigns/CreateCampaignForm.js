import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Combobox } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

import { renderCombobox, renderField, renderTextEditor, renderRadio } from './FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const CreateCampaignForm = props => {

  const { touch, valid, pristine, submitting, nextPage, reset, applyTemplate } = props;

  const lists = props.lists.map(x => x.name);
  const templates = props.templates.map(x => x.name);
  const nameArray = ['listName', 'campaignName', 'fromName', 'fromEmail', 'emailSubject', 'emailBody', 'type']; // A list of all fields that need to show errors/warnings

  const resetFormAndSubmit = e => {
    e.preventDefault();
    if (valid) {
      nextPage();
    } else {
      touch(...nameArray);
    }
  };

  const applyForm = () => {
    const applyTemplateValue = document.getElementById('templates_input').value; // Get template name
    const foundTemplate = props.templates.find(x => x.name === applyTemplateValue);
    if (!foundTemplate) { // Template does not exist

    } else {
      applyTemplate(foundTemplate);
    }
  };

  return (
    <div>
      <h3>Apply template</h3>
      <Combobox id="templates" data={templates} suggest={true} filter="contains" />
      <br/>
      <button type="button" onClick={applyForm} className="btn btn-success btn-lg">Apply</button>


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
    </div>
  );
};

CreateCampaignForm.propTypes = {
  touch: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  nextPage: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  applyTemplate: PropTypes.func.isRequired
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
