import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';
import {
  getReceivedPermissionOffers,
  deleteRejectReceivedOffers,
  getActivePermissions,
  deleteActivePermissions,
  postAcceptReceivedOffers
} from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';

import ManageReceivedPermissionOffersTable from '../../components/permissions/ManageReceivedPermissionOffersTable';
import ManageActivePermissionsTable from '../../components/permissions/ManageActivePermissionsTable';
import ManageGrantedPermissionsTable from '../../components/permissions/ManageGrantedPermissionsTable';

function mapStateToProps(state) {
  // State reducer @ state.receivedPermissionOffers
  return {
    isGettingReceivedPermissionOffers: state.receivedPermissionOffers.isGetting,
    receivedPermissionOffers: state.receivedPermissionOffers.receivedPermissionOffers,

    isGettingActivePermissions: state.activePermissions.isGetting,
    activePermissions: state.activePermissions.activePermissions
  };
}

@connect(mapStateToProps, { getReceivedPermissionOffers, deleteRejectReceivedOffers, getActivePermissions, deleteActivePermissions, postAcceptReceivedOffers })
export default class GrantPermissions extends Component {

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
    postAcceptReceivedOffers: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteReceivedPermissionOfferRows = this.deleteReceivedPermissionOfferRows.bind(this);
    this.acceptReceivedPermissionOfferRows = this.acceptReceivedPermissionOfferRows.bind(this);
    this.deleteActivePermissionRows = this.deleteActivePermissionRows.bind(this);
    this.deleteGrantedPermissionRows = this.deleteGrantedPermissionRows.bind(this);
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
    this.props.deleteRejectReceivedOffers(offerIds, this.props.receivedPermissionOffers);
  }

  acceptReceivedPermissionOfferRows(offerIds) {
    this.props.postAcceptReceivedOffers(offerIds, this.props.receivedPermissionOffers);
  }

  deleteActivePermissionRows(offerIds) {
    this.props.deleteActivePermissions(offerIds, this.props.activePermissions);
  }

  deleteGrantedPermissionRows(offerIds) {

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
              <ManageActivePermissionsTable data={activePermissions} deletePermissionRows={this.deleteActivePermissionRows} />
            </div>

            {isGettingActivePermissions && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

          <div className="box box-primary">

            <div className="box-header">
              <h2>Granted permissions</h2>
            </div>

            <div className="box-body">
              <ManageGrantedPermissionsTable data={activePermissions} deletePermissionRows={this.deleteGrantedPermissionRows} />
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
