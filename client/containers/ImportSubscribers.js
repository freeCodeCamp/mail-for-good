import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';

import parseSubscriberList from '../utils/subscriberListParsers/parseSubscriberList';
import { addSubscribers } from '../actions/subscribersActions';


@connect(null, { addSubscribers })
export default class ImportSubscribers extends React.Component {
  constructor() {
    super();
    
    this.state = {
      fields: null,
      subscribers: null
    };
  }

  onUpload(file) {
    const read = new FileReader();
    read.readAsBinaryString(file[0]);
    read.onloadend = function() {
      this.handleUploadSuccess(read.result);
    }.bind(this);
  }

  handleUploadSuccess(text) {
    const data = parseSubscriberList(text);
    
    this.setState({
      subscribers: data.subscribers,
      fields: data.fields
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const newSubscribers = {
      subscribers: this.state.subscribers,
      fields: this.state.fields
    };
    
    this.props.addSubscribers(newSubscribers);
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Dropzone onDrop={this.onUpload.bind(this)}>
          drag csv here
        </Dropzone>
        {this.state.subscribers && this.state.subscribers.map((subscriber) => {
          return (
            <div>
              {subscriber.email}
            </div>
          );
        })
        }
        <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    );
  }
}
