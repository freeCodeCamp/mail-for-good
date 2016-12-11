import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';

import GrantPermissionForm from '../../components/permissions/GrantPermissionForm';

import FontAwesome from 'react-fontawesome';

function mapStateToProps(state) {
  // State reducer @ state.receivedPermissionOffers
  return {
    isGettingReceivedPermissionOffers: state.receivedPermissionOffers.isGetting,
    receivedPermissionOffers: state.receivedPermissionOffers.receivedPermissionOffers
  };
}

@connect(mapStateToProps, null)
export default class GrantPermissions extends Component {

  static propTypes = {
    isGettingReceivedPermissionOffers: PropTypes.bool.isRequired,
    receivedPermissionOffers: PropTypes.array.isRequired
  }

  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <div className="content-header">
          <h1>Manage Permissions
            <small>Manage permissions you've granted and those granted to you</small>
          </h1>
        </div>

        <section className="content col-md-6">
          <div className="box box-primary">
            <div className="box-body">

            </div>

            {/*<div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>*/}
          </div>
        </section>

      </div>
    );
  }
}
