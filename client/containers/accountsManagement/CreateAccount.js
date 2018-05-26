import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateAccountForm from '../../components/accountsManagement/CreateAccountForm';
import { notify } from '../../actions/notificationActions';
import { postCreateNewUser } from '../../actions/accountsManagementActions';

import FontAwesome from 'react-fontawesome';

function mapStateToProps(state) {
  // State reducer @ state.form & state.offerPermission
  return {
    form: state.form.createAccount,
    isPosting: state.createAccount.isPosting,
    response: state.createAccount.response,
    queriersEmail : state.profile.user.email
  };
}

const mapDispatchToProps = { notify, postCreateNewUser };

export class CreateUserComponent extends Component {

  static propTypes = {
    // redux
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    response: PropTypes.object.isRequired,
    queriersEmail: PropTypes.string.isRequired,
    // actions
    notify: PropTypes.func.isRequired,
    postCreateNewUser: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.response.message && (nextProps.isPosting === false && this.props.isPosting)) {
      const responseColour = nextProps.response.status === 200 ? 'green' : 'red';
      this.props.notify({ message: nextProps.response.message, colour: responseColour });
    }
  }

  handleSubmit() {
    let requestData = {...this.props.form.values};
    requestData.queriersEmail = this.props.queriersEmail;
    this.props.postCreateNewUser(requestData);
  }

  render() {
    const { isPosting } = this.props;
    const initialValues = {
      email: '',
      password: '',
      passwordConfirm: '',
      isAdmin:false
    };

    return (
      <div>
        <div className="content-header">
          <h1>Create new user</h1>
        </div>

        <section className="content col-md-6">
          <div className="box box-primary">
            <div className="box-body">
              <CreateAccountForm handleSubmit={this.handleSubmit} initialValues={initialValues} />
            </div>

            {isPosting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>
        </section>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserComponent);
