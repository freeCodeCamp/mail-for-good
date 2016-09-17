import React from 'react';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { connect } from 'react-redux';

import deepFillArray from '../utils/deepFillArray';
import countColumnsInFile from '../utils/countColumnsInFile';
import parseSubscriberList from '../utils/subscriberListParsers/parseSubscriberList';
import { addSubscribers } from '../actions/subscribersActions';


@connect(null, { addSubscribers })
export default class ImportSubscribers extends React.Component {
  constructor() {
    super();
    
    this.state = {
      file: '',
      fields: ['']
    };
  }

  onUpload(file) {
    const read = new FileReader();
    read.readAsBinaryString(file[0]);
    read.onloadend = function() {
      this.handleUploadSuccess(read.result);
    }.bind(this)
  }

  handleUploadSuccess(text) {
    // Keep the uploaded file around for processing by the user
    // and create an array whose elements will correspond to each column
    // so the user can assign types/variables to the columns
    // e.g. fields[0] (col 1) could be 'email' of type 'email'
    // or fields[1] (col 2) could be 'favourite colour' of type 'text'
    // or fields[2] (col 3) could be 'lucky number' of type 'int'
    const field = {name: '', type: ''};
    this.setState({
      file: text,
      fields: deepFillArray(countColumnsInFile(text), field)
    });
  }

  handleFieldNameChange(field, e) {
    this.handleFieldChange(field, 'name', e.target.value);
  }

  handleFieldTypeChange(field, e) {
    this.handleFieldChange(field, 'type', e.target.value);
  }

  handleFieldChange(field, selection, value) {
    // cleaner way to do this replacement?
    let newFields = this.state.fields;
    newFields[field][selection] = value;
    console.log(field);
    console.log(selection);
    this.setState({
      fields: newFields
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.addSubscribers(parseSubscriberList(this.state.file, this.state.fields), this.state.fields);
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Dropzone onDrop={this.onUpload.bind(this)}>
          drag csv here
        </Dropzone>
        <form>
          {this.state.file && _.range(this.state.fields.length).map((field) => {
            return (
              <div>
                col: {field}
                
                <input 
                  type="text" 
                  value={this.state.fields[field].name}
                  onChange={this.handleFieldNameChange.bind(this, field)}
                />

                <select
                  value={this.state.fields[field].type}
                  onChange={this.handleFieldTypeChange.bind(this, field)}
                >
                  <option selected="selected" value="">none</option>
                  <option value="email">email</option>
                  <option value="number">number</option>
                  <option value="text">text</option>
                  <option value="group">group</option>
                </select>

                <br/>
              </div>
            )
          })}
          <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
          (should ignore name of field if it is of email type)
        </form>
      </div>
    )
  }
}
