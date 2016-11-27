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
        <button className="btn pull-left btn-lg btn-primary" type="submit" onClick={this.open.bind(this)}>Import</button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Import Subscribers</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormControl className="btn" type="file" onChange={this.onUpload.bind(this)} />
          </Modal.Body>

          <Modal.Footer>
            <button className="btn pull-left btn-lg btn-success" type="submit" onClick={this.handleSubmit.bind(this)}>Upload</button>
            <button className="btn pull-right btn-lg btn-danger" type="submit" onClick={this.close.bind(this)}>Cancel</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

UploadFileModal.propTypes = {
  handleNewFile: React.PropTypes.func.isRequired
};
