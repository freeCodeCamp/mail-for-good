import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GrantPermissionForm from '../../components/permissions/GrantPermissionForm';
import { notify } from '../../actions/notificationActions';
import { postGrantPermission } from '../../actions/permissionActions';

import FontAwesome from 'react-fontawesome';

function mapStateToProps(state) {
  // State reducer @ state.form & state.offerPermission
  return {
    form: state.form.grantPermission,
    isPosting: state.grantPermissions.isPosting,
    response: state.grantPermissions.response
  };
}

const mapDispatchToProps = { notify, postGrantPermission };

export class GrantPermissionsComponent extends Component {

  static propTypes = {
    // redux
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    response: PropTypes.object.isRequired,
    // actions
    notify: PropTypes.func.isRequired,
    postGrantPermission: PropTypes.func.isRequired
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
    this.props.postGrantPermission(JSON.stringify(this.props.form.values));
  }

  render() {
    const { isPosting } = this.props;

    const initialValues = {
      campaigns: 'None',
      templates: 'None',
      lists: 'None'
    };

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
              <GrantPermissionForm handleSubmit={this.handleSubmit} initialValues={initialValues} />
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

export default connect(mapStateToProps, mapDispatchToProps)(GrantPermissionsComponent);