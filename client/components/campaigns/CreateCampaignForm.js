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
// Ref react-widgets https://jquense.github.io/react-widgets/
// Ref react-rte https://github.com/sstur/react-rte

const colors = [
    {
        color: 'Red',
        value: 'ff0000'
    }, {
        color: 'Green',
        value: '00ff00'
    }, {
        color: 'Blue',
        value: '0000ff'
    }
];

const CreateCampaignForm = (props) => {
    const {handleSubmit, pristine, reset, submitting} = props;

    return (

        <form onSubmit={handleSubmit}>

            <h3>Select list & relay server</h3>
            <div>
                <label>Relay server</label>
                <Field name="relayServer" component={SelectList} data={['Amazon SES']}/>
            </div>

            <div>
                <label>Select a List</label>
                <Field name="list" component={Combobox} data={colors} valueField="value" textField="color"/>
            </div>

            <hr/>

            <h3>Campaign details</h3>
            <div>
                <label>Campaign Name -
                    <small>the name of this campaign</small>
                </label>
                <Field name="campaignName" component={DropdownList} data={colors} valueField="value" textField="color"/>
            </div>

            <div>
                <label>Email: from (name) -
                    <small>your name e.g. from <i>Bob</i> {'<bob@bobmail.com>'}</small>
                </label>
                <Field name="fromName" component={DropdownList} data={colors} valueField="value" textField="color"/>
            </div>

            <div>
                <label>Email: from (email) -
                    <small>ensure you are authorised to send email to the relay server</small>
                </label>
                <Field name="fromEmail" component={DropdownList} data={colors} valueField="value" textField="color"/>
            </div>

            <hr/>

            <h3>Create email</h3>

            <div>
                <label>Email Subject</label>
                <Field name="emailSubject" component={DropdownList} data={colors} valueField="value" textField="color"/>
            </div>

            <div>
                <label>Write Email</label>
                <Field name="emailBody" component={TextEditor} />
            </div>

            <br/>
            <div>
                <button className="btn btn-primary btn-lg pull-left" type="submit" disabled={pristine || submitting}>Submit</button>
                <button className="btn btn-danger btn-lg pull-right" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values
                </button>
            </div>
        </form>
    )
}

// Use reduxForm decorator
export default reduxForm({form: 'createCampaign', destroyOnUnmount: false})(CreateCampaignForm);
