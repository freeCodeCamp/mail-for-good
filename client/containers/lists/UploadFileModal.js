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
  }

  close() {
    this.setState({
      showModal: false
    });
  }

  onUpload(e) {
    this.setState({
      uploading: true
    });
    const files = e.target.files;
    this.handleUploadSuccess(files[0]);
  }

  handleUploadSuccess(file) {
    this.setState({
      uploading: false,
      file
    });
  }

  handleSubmit() {
    this.props.handleNewFile(this.state.file);
    this.close();
  }


  render() {
    return (
      <div>
        {/* This should really be in the ImportSubscribers container...*/}
        <Button bsSize="large" bsStyle="primary" onClick={this.open.bind(this)}>
          Import
        </Button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Import Subscribers</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormControl className="btn" type="file" onChange={this.onUpload.bind(this)} />
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
