import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';
import { postPermissionOffer } from '../../actions/permissionActions';

import GrantPermissionForm from '../../components/permissions/GrantPermissionForm';

import FontAwesome from 'react-fontawesome';

function mapStateToProps(state) {
  // State reducer @ state.form & state.offerPermission
  return {
    form: state.form.grantPermission,
    isPosting: state.offerPermission.isPosting,
    response: state.offerPermission.response
  };
}

@connect(mapStateToProps, { postPermissionOffer })
export default class GrantPermissions extends Component {

  static propTypes = {
    // redux
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    response: PropTypes.object.isRequired,
    // actions
    postPermissionOffer: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

  }

  render() {
    const { isPosting } = this.props;
    return (
      <div>
        <div className="content-header">
          <h1>Grant Permissions
            <small>Grant permissions to users</small>
          </h1>
        </div>

        <section className="content col-md-6">
          <div className="box box-primary">
            <div className="box-body">
              <GrantPermissionForm handleSubmit={this.handleSubmit}/>
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
