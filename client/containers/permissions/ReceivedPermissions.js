import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';
import {
  getReceivedPermissionOffers,
  postAcceptReceivedOffers,
  deleteRejectReceivedOffers,

  getActivePermissions,
  deleteActivePermissions
} from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';

import ManageReceivedPermissionOffersTable from '../../components/permissions/ManageReceivedPermissionOffersTable';
import ManageActivePermissionsTable from '../../components/permissions/ManageActivePermissionsTable';

function mapStateToProps(state) {
  // State reducer @ state.receivedPermissionOffers
  return {
    isGettingReceivedPermissionOffers: state.receivedPermissionOffers.isGetting,
    receivedPermissionOffers: state.receivedPermissionOffers.receivedPermissionOffers,

    isGettingActivePermissions: state.activePermissions.isGetting,
    activePermissions: state.activePermissions.activePermissions
  };
}

const mapDispatchToProps = {
  getReceivedPermissionOffers, deleteRejectReceivedOffers, postAcceptReceivedOffers,
  getActivePermissions, deleteActivePermissions,
  notify };

export class ReceivedPermissionsComponent extends Component {

  static propTypes = {
    // redux
    isGettingReceivedPermissionOffers: PropTypes.bool.isRequired,
    receivedPermissionOffers: PropTypes.array.isRequired,

    isGettingActivePermissions: PropTypes.bool.isRequired,
    activePermissions: PropTypes.array.isRequired,

    // actions
    getReceivedPermissionOffers: PropTypes.func.isRequired,
    deleteRejectReceivedOffers: PropTypes.func.isRequired,
    getActivePermissions: PropTypes.func.isRequired,
    deleteActivePermissions: PropTypes.func.isRequired,
    postAcceptReceivedOffers: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteReceivedPermissionOfferRows = this.deleteReceivedPermissionOfferRows.bind(this);
    this.acceptReceivedPermissionOfferRows = this.acceptReceivedPermissionOfferRows.bind(this);
    this.deleteActivePermissionRows = this.deleteActivePermissionRows.bind(this);
  }

  componentDidMount() {
    this.props.getReceivedPermissionOffers();
    this.props.getActivePermissions();
  }

  deleteReceivedPermissionOfferRows(offerIds) {
    if (!offerIds.length) {
      this.props.notify({ message: 'You have not selected any offers' });
      return;
    }
    this.props.deleteRejectReceivedOffers(offerIds, this.props.receivedPermissionOffers);
  }

  acceptReceivedPermissionOfferRows(offerIds) {
    if (!offerIds.length) {
      this.props.notify({ message: 'You have not selected any offers to accept' });
      return;
    }
    this.props.postAcceptReceivedOffers(offerIds, this.props.receivedPermissionOffers);
  }

  deleteActivePermissionRows(offerIds) {
    if (!offerIds.length) {
      this.props.notify({ message: 'You have not selected any offers' });
      return;
    }
    this.props.deleteActivePermissions(offerIds, this.props.activePermissions);
  }

  render() {
    const { isGettingReceivedPermissionOffers, receivedPermissionOffers,
            isGettingActivePermissions, activePermissions } = this.props;
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
              <ManageActivePermissionsTable data={activePermissions} deletePermissionRows={this.deleteActivePermissionRows} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceivedPermissionsComponent);