import React, { PropTypes } from 'react';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import { Combobox } from 'react-widgets';
import _ from 'lodash';

import { renderCombobox, renderField, renderTextEditor, renderEditorTypeRadio } from '../common/FormRenderWrappers';

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const CreateCampaignForm = props => {

  const {
    touch,
    valid,
    invalid,
    pristine,
    submitting,
    nextPage,
    reset,
    applyTemplate,
    textEditorType,
    passResetToState
  } = props;

  const lists = props.lists.map(x => x.name);
  const templates = props.templates.map(x => x.name);
  const nameArray = [
    'listName',
    'campaignName',
    'fromName',
    'fromEmail',
    'emailSubject',
    'emailBodyPlaintext',
    'emailBodyHTML',
    'type',
    'trackingPixelEnabled',
    'trackLinksEnabled',
    'unsubscribeLinkEnabled'
  ]; // A list of all fields that need to show errors/warnings

  const resetFormAndSubmit = e => {
    e.preventDefault();
    if (valid) {
      passResetToState(reset);
      nextPage();
    } else {
      touch(...nameArray);
    }
  };

  const applyForm = (applyTemplateValue) => {
    const foundTemplate = props.templates.find(x => x.name === applyTemplateValue);
    applyTemplate(foundTemplate);
  };

  const resetForm = () => {
    reset();
  };

  return (
    <div>
      <h3>Apply template</h3>
      <Combobox id="templates" data={templates} suggest={true} onSelect={value => applyForm(value)} filter="contains" />
      <br/>

      <form onSubmit={resetFormAndSubmit}>
        <h3>Select a List</h3>
        <div>
          <Field name="listName" component={renderCombobox} data={lists} />
        </div>

        <hr/>

        <h3>Campaign details</h3>
        {/* TODO: This needs to be validated via regex. Doesn't need to be a slug but must resolve to a unique slug so there's no possibility of conflict. */}
        <Field name="campaignName" component={renderField} label="Campaign Name" type="text" />
        <Field name="fromName" component={renderField} label="From Name" type="text" />
        <Field name="fromEmail" component={renderField} label="From Email" type="email" />

        <hr/>

        <h3>Analytics</h3>
        <div><label><Field disabled={textEditorType == 'Plaintext'} name="trackingPixelEnabled" component="input" type="checkbox" /> Insert tracking pixel. Available for HTML emails only.</label></div>
        <div><label><Field disabled={textEditorType == 'Plaintext'} name="trackLinksEnabled" component="input" type="checkbox" /> Track link clickthroughs, syntax: {`{linklabel/http://mylinktotrack.com}`}. Available for HTML emails only. </label></div>
        <div><label><Field name="unsubscribeLinkEnabled" component="input" type="checkbox" /> Add unsubscribe link</label></div>
        <hr/>

        <h3>Create email</h3>
        <Field name="type" component={renderEditorTypeRadio} label="Type of email" />
        <Field name="emailSubject" component={renderField} label="Subject" type="text" />
        {/* We only want to render the textEditor that we are using, and we maintain state for each */}
        <Field name={`emailBody${textEditorType}`} emailBody={`emailBody${textEditorType}`} component={renderTextEditor} label="Write Email" textEditorType={textEditorType} />
        <br/>
        <div className="box-footer">
          <div className="btn-group">
            <button className="btn btn-success btn-lg btn-hug" type="submit" disabled={invalid}>Next Step</button>
            <button className="btn btn-danger btn-lg btn-hug" type="button" disabled={pristine || submitting} onClick={resetForm}>Reset</button>
          </div>
        </div>
      </form>
    </div>
  );
};

CreateCampaignForm.propTypes = {
  ...reduxFormPropTypes,
  nextPage: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  applyTemplate: PropTypes.func.isRequired,
  textEditorType: PropTypes.string.isRequired,
  passResetToState: PropTypes.func.isRequired,
};

const validate = (values, props) => {
  const errors = {};

  if (!values.listName) {
    errors.listName = 'Required';
  } else if (_.find(props.lists, list => list.name == values.listName).status != 'ready') {
    errors.listName = 'This list is still being imported.';
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
  // For the fields below, bare in mind there is only ever one rendered email editor
  // But multiple state fields
  if (!values.emailBodyPlaintext && values.type === 'Plaintext') {
    errors.emailBodyPlaintext = 'Required';
  }
  // <div><br></div> is what an empty quill editor contains
  if (values.emailBodyHTML === '<div><br></div>' && values.type === 'HTML') {
    errors.emailBodyHTML = 'Required';
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
