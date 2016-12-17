import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import { notify } from '../../actions/notificationActions';
import {
  getGrantPermissions,
  deleteGrantedPermissions,

  getReceivedPermissionOffers,
  postAcceptReceivedOffers,
  deleteRejectReceivedOffers,

  getActivePermissions,
  deleteActivePermissions,

  getGrantOfferedPermissions,
  deleteGrantOfferedPermissions
} from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';

import ManageReceivedPermissionOffersTable from '../../components/permissions/ManageReceivedPermissionOffersTable';
import ManageActivePermissionsTable from '../../components/permissions/ManageActivePermissionsTable';
import ManageGrantOfferedPermissionsTable from '../../components/permissions/ManageGrantOfferedPermissionsTable';
import ManageGrantedPermissionsTable from '../../components/permissions/ManageGrantedPermissionsTable';

function mapStateToProps(state) {
  // State reducer @ state.receivedPermissionOffers
  return {
    isGettingGrantedPermissions: state.grantPermissions.isGetting,
    grantedPermissions: state.grantPermissions.grantedPermissions,

    isGettingReceivedPermissionOffers: state.receivedPermissionOffers.isGetting,
    receivedPermissionOffers: state.receivedPermissionOffers.receivedPermissionOffers,

    isGettingActivePermissions: state.activePermissions.isGetting,
    activePermissions: state.activePermissions.activePermissions,

    isGettingGrantOfferedPermissions: state.grantOfferedPermissions.isGetting,
    grantOfferedPermissions: state.grantOfferedPermissions.grantOfferedPermissions
  };
}

@connect(mapStateToProps, {
  getGrantPermissions, deleteGrantedPermissions,
  getReceivedPermissionOffers, deleteRejectReceivedOffers, postAcceptReceivedOffers,
  getActivePermissions, deleteActivePermissions,
  getGrantOfferedPermissions, deleteGrantOfferedPermissions })
export default class GrantPermissions extends Component {

  static propTypes = {
    // redux
    isGettingGrantedPermissions: PropTypes.bool.isRequired,
    grantedPermissions: PropTypes.array.isRequired,

    isGettingReceivedPermissionOffers: PropTypes.bool.isRequired,
    receivedPermissionOffers: PropTypes.array.isRequired,

    isGettingActivePermissions: PropTypes.bool.isRequired,
    activePermissions: PropTypes.array.isRequired,

    isGettingGrantOfferedPermissions: PropTypes.bool.isRequired,
    grantOfferedPermissions: PropTypes.array.isRequired,
    // actions
    getGrantPermissions: PropTypes.func.isRequired,
    deleteGrantedPermissions: PropTypes.func.isRequired,
    getReceivedPermissionOffers: PropTypes.func.isRequired,
    deleteRejectReceivedOffers: PropTypes.func.isRequired,
    getActivePermissions: PropTypes.func.isRequired,
    deleteActivePermissions: PropTypes.func.isRequired,
    postAcceptReceivedOffers: PropTypes.func.isRequired,
    getGrantOfferedPermissions: PropTypes.func.isRequired,
    deleteGrantOfferedPermissions: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteReceivedPermissionOfferRows = this.deleteReceivedPermissionOfferRows.bind(this);
    this.acceptReceivedPermissionOfferRows = this.acceptReceivedPermissionOfferRows.bind(this);
    this.deleteActivePermissionRows = this.deleteActivePermissionRows.bind(this);
    this.deleteGrantedPermissionRows = this.deleteGrantedPermissionRows.bind(this);
    this.deleteGrantOfferedPermissionRows = this.deleteGrantOfferedPermissionRows.bind(this);
  }

  componentDidMount() {
    if (!this.props.receivedPermissionOffers.length) {
      this.props.getReceivedPermissionOffers();
    }
    if (!this.props.activePermissions.length) {
      this.props.getActivePermissions();
    }
    if (!this.props.grantedPermissions.length) {
      this.props.getGrantPermissions();
    }
    if (!this.props.grantOfferedPermissions.length) {
      this.props.getGrantOfferedPermissions();
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
    this.props.deleteGrantedPermissions(offerIds, this.props.grantedPermissions);
  }

  deleteGrantOfferedPermissionRows(offerIds) {
    this.props.deleteGrantOfferedPermissions(offerIds, this.props.grantOfferedPermissions);
  }

  render() {
    const { isGettingGrantedPermissions, grantedPermissions,
            isGettingReceivedPermissionOffers, receivedPermissionOffers,
            isGettingActivePermissions, activePermissions,
            isGettingGrantOfferedPermissions, grantOfferedPermissions } = this.props;
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
              <ManageActivePermissionsTable data={activePermissions} deletePermissionRows={this.deleteGrantOfferedPermissionRows} />
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
              <ManageGrantedPermissionsTable data={grantedPermissions} deletePermissionRows={this.deleteGrantedPermissionRows} />
            </div>

            {isGettingGrantedPermissions && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

          <div className="box box-primary">

            <div className="box-header">
              <h2>Offered permissions</h2>
            </div>

            <div className="box-body">
              <ManageGrantOfferedPermissionsTable data={grantOfferedPermissions} deletePermissionRows={this.deleteGrantOfferedPermissionRows} />
            </div>

            {isGettingGrantOfferedPermissions && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

        </section>

      </div>
    );
  }
}
