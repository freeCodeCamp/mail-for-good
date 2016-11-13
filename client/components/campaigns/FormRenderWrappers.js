/* eslint-disable */
import React from 'react';
import { Combobox, DropdownList } from 'react-widgets';
import { Field } from 'redux-form';
import TextEditor from '../../containers/campaigns/TextEditor';

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

export const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input className="form-control" {...input} placeholder={label} type={type}/>
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderRadio = ({ input, label, type, meta: { touched, error, warning } }) => (
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

export const renderTextEditor = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <Field name="emailBody" {...input} component={TextEditor} />
      {touched && ((error && <span className="text-red"><i className="fa fa-exclamation" /> {error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
