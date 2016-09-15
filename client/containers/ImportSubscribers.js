import React from 'react';
import Dropzone from 'react-dropzone';

export default class ImportSubscribers extends React.Component {
  constructor() {
    super();
    
    this.state = {
      file: ''
    };
  }
  
  handleUploadSuccess(file) {
    console.log("got file");
    console.log(file);
    
    this.setState({
      file
    });
  }
  
  onUpload(file) {
    const read = new FileReader();
    read.readAsBinaryString(file[0]);
    read.onloadend = function() {
      this.handleUploadSuccess(read.result);
    }.bind(this)
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onUpload.bind(this)}>
          drag csv here
        </Dropzone>
      </div>
    )
  }
}
