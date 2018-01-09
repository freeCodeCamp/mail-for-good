import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';

const mapDispatchToProps = { notify };

export class ListSignupFormCreatorComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribeKey: this.props.subscribeKey,
      showModal: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      showModal: props.showModal,
      subscribeKey: props.subscribeKey
    });
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  render() {
    const actionUrl = `${window.location.origin}/api/list/subscribe`;
    const formBody = `
              <form action="${actionUrl}" target="_blank">
              <label for="signup-email">Email</label>
              <input type="email" value="" name="email" label="signup-email">
              <input type="hidden" name="subscribeKey" value="${this.state.subscribeKey}" />
              <input type="hidden" name="redirectOnSuccess" value="" />
              <input type="hidden" name="redirectOnFailure" value="" />
              <input type="submit" value="Subscribe" name="Subscribe">
              </form>
            `;

    return (
      <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Embeddable subscription form</h3>
          </div>
          <div className="modal-body">
            <h4>Allow users to sign up to your mailing list by embedding this HTML code into your website</h4>
            <br/>
            <p>Optionally, you can customize where the user is redirected on success and failure by inserting a URL in the value of the redirectOnSuccess and redirectOnFailure.</p>
            <br/>
            <textarea className="form-control" rows="5">
              {formBody}
            </textarea>
          </div>
          <div className="modal-footer">
            <CopyToClipboard text={formBody}
                             onCopy={() => {this.props.notify({message: 'Copied to clipboard', colour: 'green'}).bind(this);}}>
              <button className="btn btn-primary">Copy to clipboard</button>
            </CopyToClipboard>

          </div>
        </div>
      </Modal>
    );
  }
}

ListSignupFormCreatorComponent.propTypes = {
  notify: PropTypes.func.isRequired,
  subscribeKey: PropTypes.string
};

export default connect(null, mapDispatchToProps)(ListSignupFormCreatorComponent);
