import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { notify } from '../../actions/notificationActions';
import {
  getGrantPermissions,
  deleteGrantedPermissions,

  getGrantOfferedPermissions,
  deleteGrantOfferedPermissions
} from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';
import ManageGrantOfferedPermissionsTable from '../../components/permissions/ManageGrantOfferedPermissionsTable';
import ManageGrantedPermissionsTable from '../../components/permissions/ManageGrantedPermissionsTable';

function mapStateToProps(state) {
  return {
    isGettingGrantedPermissions: state.grantPermissions.isGetting,
    grantedPermissions: state.grantPermissions.grantedPermissions,

    isGettingGrantOfferedPermissions: state.grantOfferedPermissions.isGetting,
    grantOfferedPermissions: state.grantOfferedPermissions.grantOfferedPermissions
  };
}

const mapDispatchToProps = {
  getGrantPermissions, deleteGrantedPermissions,
  getGrantOfferedPermissions, deleteGrantOfferedPermissions,
  notify };

export class OfferedPermissionsComponent extends Component {

  static propTypes = {
    // redux
    isGettingGrantedPermissions: PropTypes.bool.isRequired,
    grantedPermissions: PropTypes.array.isRequired,

    isGettingGrantOfferedPermissions: PropTypes.bool.isRequired,
    grantOfferedPermissions: PropTypes.array.isRequired,
    // actions
    getGrantPermissions: PropTypes.func.isRequired,
    deleteGrantedPermissions: PropTypes.func.isRequired,
    getGrantOfferedPermissions: PropTypes.func.isRequired,
    deleteGrantOfferedPermissions: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteGrantedPermissionRows = this.deleteGrantedPermissionRows.bind(this);
    this.deleteGrantOfferedPermissionRows = this.deleteGrantOfferedPermissionRows.bind(this);
  }

  componentDidMount() {
    this.props.getGrantPermissions();
    this.props.getGrantOfferedPermissions();
  }

  deleteGrantedPermissionRows(offerIds) {
    if (!offerIds.length) {
      this.props.notify({ message: 'You have not selected any offers' });
      return;
    }
    this.props.deleteGrantedPermissions(offerIds, this.props.grantedPermissions);
  }

  deleteGrantOfferedPermissionRows(offerIds) {
    if (!offerIds.length) {
      this.props.notify({ message: 'You have not selected any offers' });
      return;
    }
    this.props.deleteGrantOfferedPermissions(offerIds, this.props.grantOfferedPermissions);
  }

  render() {
    const { isGettingGrantedPermissions, grantedPermissions,
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

export default connect(mapStateToProps, mapDispatchToProps)(OfferedPermissionsComponent);