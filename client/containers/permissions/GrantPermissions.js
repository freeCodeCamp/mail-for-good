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
    response: state.offerPermission.lists
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

        <section className="content">
          <div className="box box-primary">
            <div className="box-body">
              <GrantPermissionForm />
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
