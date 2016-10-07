import React, {Component} from 'react';
import {Field, reduxForm, propTypes} from 'redux-form';
import {DropdownList, SelectList, Multiselect, Combobox} from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

import TextEditor from './CreateCampaignFormTextEditor';

/*
    TODO: Consider turning this into a wizard (see http://redux-form.com/6.0.5/examples/wizard/)
    Rough guide to questions we need to ask:
        1. Which list to commit the campaign on. Entire list? If not, redirect to lists to create a new list/segment
        2. Descriptive questions (Campaign name, email from name, from email & subject)
        3. What to send (plainscript for now)
*/

// Ref redux-form http://redux-form.com/6.0.5/docs/GettingStarted.md/
// Ref react-widgets https://jquense.github.io/react-widgets/ (for examples see https://github.com/erikras/redux-form/blob/master/examples/react-widgets/src/ReactWidgetsForm.js)
// Ref react-rte https://github.com/sstur/react-rte

const renderCombobox = ({ input, ...rest }) => <Combobox {...input} {...rest} />;
const renderSelectList = ({ input, ...rest }) => <SelectList {...input} onBlur={() => input.onBlur()} {...rest}/>;

/*
Helper wrapper functions for react-widgets from the redux-form examples page. May be useful later.

const renderDropdownList = ({ input, ...rest }) => <DropdownList {...input} {...rest}/>;
const renderMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    {...rest}/>;
*/

const tempLists = ['aListBelongingToTheUser', 'anotherListBelongingToTheUser'];
const tempTemplates = ['aTemplate', 'anotherTemplate'];

const CreateCampaignForm = (props) => {
  const {handleSubmit, pristine, reset, submitting} = props;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select email type, relay server & list</h3>
      <div>
        <label>Send email as</label>
        <Field name="type" component={renderSelectList} data={['Plaintext', 'HTML']}/>
      </div>

      <div>
        <label>Relay server</label>
        <Field name="relayServer" component={renderSelectList} data={['Amazon SES']}/>
      </div>

      <div>
        <label>Select a List</label>
        <Field name="list" component={renderCombobox} data={tempLists} />
      </div>

      <hr/>

      <h3>Campaign details</h3>
      <div>
        <label>Campaign Name -
          <small>the name of this campaign</small>
        </label>
        <Field className="form-control" name="campaignName" component="input" type="text"/>
      </div>

      <div>
        <label>Email: from (name) -
          <small>your name e.g. from
            <i>Bob</i>
            {'<bob@bobmail.com>'}</small>
        </label>
        <Field className="form-control" name="fromName" component="input"/>
      </div>

      <div>
        <label>Email: from (email) -
          <small>ensure this email is authorised to send email to the relay server</small>
        </label>
        <Field className="form-control" name="fromEmail" component="input"/>
      </div>

      <hr/>

      <h3>Create email</h3>
      <div>
        <label>Import from template</label>
        <Field name="template" component={renderCombobox} data={tempTemplates} />
      </div>

      <div>
        <label>Email Subject</label>
        <Field className="form-control" name="emailSubject" component="input"/>
      </div>

      <div>
        <label>Write Email</label>
        <Field name="emailBody" component={TextEditor}/>
      </div>

      <br/>
      <div>
        <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Create</button>
        <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
      </div>
    </form>
  );
};

// Use reduxForm decorator
export default reduxForm({form: 'createCampaign', destroyOnUnmount: false})(CreateCampaignForm);
