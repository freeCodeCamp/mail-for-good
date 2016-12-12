import React from 'react';
import { Modal } from 'react-bootstrap';


export default class ListSignupFormCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribeKey: this.props.subscribeKey,
      showModal: false
    };
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      showModal: props.showModal,
      subscribeKey: props.subscribeKey
    })
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  render() {
    const actionUrl = `${window.location.origin}/api/list/subscribe`;

    return (
      <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 class="modal-title">Modal title</h4>
          </div>
          <div className="modal-body">
            {`
              <form action="${actionUrl}" target="_blank">\n
              <label for="signup-email">Email</label>
              <input type="email" value="" name="email" label="signup-email">
              <input type="hidden" name="subscribeKey" value="${this.state.subscribeKey}" />
              </form>
            `}
          </div>
          <div className="modal-footer">Footer</div>
        </div>
      </Modal>
    );
  }
}

