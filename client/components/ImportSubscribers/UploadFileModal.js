import React from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';


export default class UploadFileModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      uploading: false,
      text: ''
    };
  }

  open() {
    this.setState({
      showModal: true,
      text: ''
    });
  };

  close() {
    this.setState({
      showModal: false
    });
  };
  
  onUpload(e) {
    this.setState({
      uploading: true
    });
    
    // Read the file locally
    const files = e.target.files;
    const read = new FileReader();
    read.readAsBinaryString(files[0]);
    read.onloadend = function() {
      this.handleUploadSuccess(read.result);
    }.bind(this);
  }

  handleUploadSuccess(text) {
    this.setState({
      uploading: false,
      text
    });
  }
  
  handleSubmit() {
    this.props.handleNewFile(this.state.text);
    this.close();
  }


  render() {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.open.bind(this)}>
          Import subscribers
        </Button>
        
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Import Subscribers</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <FormControl type="file" onChange={this.onUpload.bind(this)} help="nope"/>
          </Modal.Body>
          
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Upload</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

UploadFileModal.propTypes = {
  handleNewFile: React.PropTypes.func.isRequired
};

