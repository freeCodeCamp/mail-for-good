import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';
import { getReceivedPermissionOffers, getActivePermissions, postAcceptReceivedOffers } from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';

import ManageReceivedPermissionOffersTable from '../../components/permissions/ManageReceivedPermissionOffersTable';
import ManagePermissionTable from '../../components/permissions/ManagePermissionTable';

function mapStateToProps(state) {
  // State reducer @ state.receivedPermissionOffers
  return {
    isGettingReceivedPermissionOffers: state.receivedPermissionOffers.isGetting,
    receivedPermissionOffers: state.receivedPermissionOffers.receivedPermissionOffers,

    isGettingActivePermissions: state.activePermissions.isGetting,
    activePermissions: state.activePermissions.activePermissions
  };
}

@connect(mapStateToProps, { getReceivedPermissionOffers, getActivePermissions, postAcceptReceivedOffers })
export default class GrantPermissions extends Component {

  static propTypes = {
    // redux
    isGettingReceivedPermissionOffers: PropTypes.bool.isRequired,
    receivedPermissionOffers: PropTypes.array.isRequired,
    isGettingActivePermissions: PropTypes.array.isRequired,
    activePermissions: PropTypes.array.isRequired,
    // actions
    getReceivedPermissionOffers: PropTypes.func.isRequired,
    getActivePermissions: PropTypes.func.isRequired,
    postAcceptReceivedOffers: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteReceivedPermissionOfferRows = this.deleteReceivedPermissionOfferRows.bind(this);
    this.acceptReceivedPermissionOfferRows = this.acceptReceivedPermissionOfferRows.bind(this);
    this.deletePermissionRows = this.deletePermissionRows.bind(this);
  }

  componentDidMount() {
    // Update receivedPermissionOffers only if we need to
    if (!this.props.receivedPermissionOffers.length) {
      this.props.getReceivedPermissionOffers();
    }
    if (!this.props.activePermissions.length) {
      this.props.getActivePermissions();
    }
  }

  deleteReceivedPermissionOfferRows(offerIds) {
    console.log(offerIds);
  }

  acceptReceivedPermissionOfferRows(offerIds) {
    this.props.postAcceptReceivedOffers(offerIds);
  }

  deletePermissionRows(offerIds) {
    console.log(offerIds);
  }

  render() {
    const { receivedPermissionOffers, isGettingReceivedPermissionOffers, isGettingActivePermissions, activePermissions } = this.props;
    return (
      <div>
        <div className="content-header">
          <h1>Manage Permissions
            <small>Manage permissions you've granted and those granted to you</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">

            <div className="box-header">
              <h2>Permission access you've been offered</h2>
            </div>

            <div className="box-body">
              <ManageReceivedPermissionOffersTable data={receivedPermissionOffers} rejectRows={this.deleteReceivedPermissionOfferRows} acceptRows={this.acceptReceivedPermissionOfferRows} />
            </div>

            {isGettingReceivedPermissionOffers && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

          <div className="box box-primary">

            <div className="box-header">
              <h2>Active permissions</h2>
            </div>

            <div className="box-body">
              <ManagePermissionTable data={activePermissions} deletePermissionRows={this.deletePermissionRows} />
            </div>

            {isGettingActivePermissions && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>
        </section>

      </div>
    );
  }
}
