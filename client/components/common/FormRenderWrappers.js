/* eslint-disable */
import React from 'react';
import { Combobox, DropdownList } from 'react-widgets';
import { Field } from 'redux-form';
import TextEditor from '../../containers/common/TextEditor';

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

const savedLabel = <div className="label label-success">Saved</div>;
const notSavedLabel = <div className="label label-danger">Not saved</div>;

export const renderSettingsDropdownList = ({ input, label, type, meta: { touched, error, warning }, exists, helpText, ...data }) => (
  <div style={{ marginBottom: "1em" }}>
    <label>{label} - { exists ? savedLabel : notSavedLabel }</label>
    <p className="form-text text-muted">{helpText}</p>
    <div>
      <DropdownList {...input} {...data} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderDropdownList = ({ input, label, type, meta: { touched, error, warning }, ...data }) => (
  <div>
    <label>{label}</label>
    <div>
      <DropdownList {...input} {...data} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderCombobox = ({ input, label, type, meta: { touched, error, warning }, ...data }) => (
  <div>
    <label>{label}</label>
    <div>
      <Combobox {...input} {...data} suggest={true} filter="contains" />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderSettingsField = ({ input, label, type, meta: { touched, error, warning }, exists, helpText, placeholder }) => {
  return (
  <div style={{ marginBottom: "1em" }}>
    <label>{label} - { exists ? savedLabel : notSavedLabel }</label>
    <p className="form-text text-muted">{helpText}</p>
    <div>
      <input className="form-control" {...input} placeholder={placeholder} type={type}/>
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)};

export const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
  return (
  <div>
    <label>{label}</label>
    <div>
      <input className={getInputClassFromType(type)} {...input} placeholder={label} type={type}/>
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)};

export const renderEditorTypeRadio = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div className="form-group">
      <label><Field component="input" type="radio" name={input.name} value="Plaintext" /> Plaintext</label>
      <br />
      <label><Field component="input" type="radio" name={input.name} value="HTML" /> HTML</label>
      <br />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderTextEditor = ({ input, label, type, meta: { touched, error, warning }, textEditorValue, textEditorType, emailBody }) => (
  <div>
    <label>{label}</label>
    <div>
      <Field name={emailBody ? emailBody : 'emailBody'} value={() => input.value} onChange={() => input.onChange} component={TextEditor} textEditorValue={textEditorValue} textEditorType={textEditorType} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

function getInputClassFromType(type) {
  let properClass = ''

  switch (type) {
    case "datetime-local":
    case "email":
    case "password":
    case "search":
    case "tel":
    case "text":
    case "url":
      properClass="form-control";
      break;
    case "checkbox":
    case "radio":
      properClass="form-check-input";
      break;
  }

  return properClass;

}
