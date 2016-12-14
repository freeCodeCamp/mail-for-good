import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderCombobox } from '../common/FormRenderWrappers';

const RightSidebar = props => {
  const { touch, valid, pristine, submitting, activePermissionsEmails, changeAccount, changeAccountToSelf, activeAccount } = props;

  const resetFormAndSubmit = e => {
    e.preventDefault();
    changeAccount();
  };

  const data = activePermissionsEmails.map(x => x.email);

  return (
    <aside className="control-sidebar control-sidebar-dark">

      <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
        <li className="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i className="fa fa-home" /></a></li>
      </ul>

      <div className="tab-content">

        <div className="tab-pane active" id="control-sidebar-home-tab">
          <h3 className="control-sidebar-heading">Account</h3>

          {activeAccount.email &&
          <ul className="control-sidebar-menu">
            <li>
              <a href="javascript:void(0)">
                <i className="menu-icon fa fa-user bg-green" />

                <div className="menu-info">
                  <h4 className="control-sidebar-subheading">{activeAccount.email}</h4>

                  <p>You are currently using this account</p>
                </div>
              </a>
            </li>
          </ul>}

            {activeAccount.email &&
            <button className="btn btn-danger btn-lg" style={{ width: "100%", marginTop: "1rem" }} onClick={changeAccountToSelf}>Use My Account</button>}

            <form onSubmit={resetFormAndSubmit}>

              <div className="form-group">

                <Field name="email" component={renderCombobox}  data={data} label="Change account" type="text" />
                <button className="btn btn-success btn-lg" type="submit" style={{ width: "100%", marginTop: "1rem" }} disabled={pristine || submitting}>Change</button>

              </div>

          </form>

        </div>
      </div>
    </aside>
  );
};

RightSidebar.propTypes = {
  touch: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,

  changeAccount: PropTypes.func.isRequired,
  changeAccountToSelf: PropTypes.func.isRequired,
  isGettingActivePermissions: PropTypes.bool.isRequired,
  activePermissionsEmails: PropTypes.array.isRequired,
  activeAccount: PropTypes.object.isRequired
};

export default reduxForm({
  form: 'activeAccount',
  destroyOnUnmount: false
})(RightSidebar);

/*

For future reference, please find a copy of the below GitHub example's control sidebar converted to JSX below
https://github.com/almasaeed2010/AdminLTE/blob/master/pages/examples/profile.html

<ul className="nav nav-tabs nav-justified control-sidebar-tabs">
  <li><a href="#control-sidebar-home-tab" data-toggle="tab"><i className="fa fa-home" /></a></li>
  <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i className="fa fa-gears" /></a></li>
</ul>

<div className="tab-content">

  <div className="tab-pane" id="control-sidebar-home-tab">
    <h3 className="control-sidebar-heading">Recent Activity</h3>
    <ul className="control-sidebar-menu">
      <li>
        <a href="javascript:void(0)">
          <i className="menu-icon fa fa-birthday-cake bg-red" />

          <div className="menu-info">
            <h4 className="control-sidebar-subheading">Langdon's Birthday</h4>

            <p>Will be 23 on April 24th</p>
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <i className="menu-icon fa fa-user bg-yellow" />

          <div className="menu-info">
            <h4 className="control-sidebar-subheading">Frodo Updated His Profile</h4>

            <p>New phone +1(800)555-1234</p>
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <i className="menu-icon fa fa-envelope-o bg-light-blue" />

          <div className="menu-info">
            <h4 className="control-sidebar-subheading">Nora Joined Mailing List</h4>

            <p>nora@example.com</p>
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <i className="menu-icon fa fa-file-code-o bg-green" />

          <div className="menu-info">
            <h4 className="control-sidebar-subheading">Cron Job 254 Executed</h4>

            <p>Execution time 5 seconds</p>
          </div>
        </a>
      </li>
    </ul>

    <h3 className="control-sidebar-heading">Tasks Progress</h3>
    <ul className="control-sidebar-menu">
      <li>
        <a href="javascript:void(0)">
          <h4 className="control-sidebar-subheading">
            Custom Template Design
            <span className="label label-danger pull-right">70%</span>
          </h4>

          <div className="progress progress-xxs">
            <div className="progress-bar progress-bar-danger" style={{ width: "70%" }} />
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <h4 className="control-sidebar-subheading">
            Update Resume
            <span className="label label-success pull-right">95%</span>
          </h4>

          <div className="progress progress-xxs">
            <div className="progress-bar progress-bar-success" style={{ width: "70%" }} />
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <h4 className="control-sidebar-subheading">
            Laravel Integration
            <span className="label label-warning pull-right">50%</span>
          </h4>

          <div className="progress progress-xxs">
            <div className="progress-bar progress-bar-warning" style={{ width: "70%" }} />
          </div>
        </a>
      </li>
      <li>
        <a href="javascript:void(0)">
          <h4 className="control-sidebar-subheading">
            Back End Framework
            <span className="label label-primary pull-right">68%</span>
          </h4>

          <div className="progress progress-xxs">
            <div className="progress-bar progress-bar-primary" style={{ width: "70%" }} />
          </div>
        </a>
      </li>
    </ul>


  </div>

  <div className="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>

  <div className="tab-pane" id="control-sidebar-settings-tab">
    <form method="post">
      <h3 className="control-sidebar-heading">General Settings</h3>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Report panel usage
          <input type="checkbox" className="pull-right" checked />
        </label>

        <p>
          Some information about this general settings option
        </p>
      </div>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Allow mail redirect
          <input type="checkbox" className="pull-right" checked />
        </label>

        <p>
          Other sets of options are available
        </p>
      </div>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Expose author name in posts
          <input type="checkbox" className="pull-right" checked />
        </label>

        <p>
          Allow the user to show his name in blog posts
        </p>
      </div>

      <h3 className="control-sidebar-heading">Chat Settings</h3>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Show me as online
          <input type="checkbox" className="pull-right" checked />
        </label>
      </div>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Turn off notifications
          <input type="checkbox" className="pull-right" />
        </label>
      </div>

      <div className="form-group">
        <label className="control-sidebar-subheading">
          Delete chat history
          <a href="javascript:void(0)" className="text-red pull-right"><i className="fa fa-trash-o" /></a>
        </label>
      </div>
    </form>
  </div>
</div>

*/
