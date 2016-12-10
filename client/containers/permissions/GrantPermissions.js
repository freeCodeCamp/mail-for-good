import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';

import { notify } from '../../actions/notificationActions';
import { postPermissionOffer } from '../../actions/permissionActions';

import GrantPermissionForm from '../../components/permissions/GrantPermissionForm';

import FontAwesome from 'react-fontawesome';

@connect(null, { postPermissionOffer })
export default class GrantPermissions extends Component {

  static propTypes = {
    postPermissionOffer: PropTypes.func.isRequired
  }

  constructor() {
    super();
  }

  render() {

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

            {/*<div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>*/}
          </div>
        </section>

      </div>
    );
  }
}
