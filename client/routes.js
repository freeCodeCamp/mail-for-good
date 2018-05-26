import React, { PropTypes, Component } from 'react';
import { Route, Router, IndexRoute } from 'react-router';
import { connect } from 'react-redux';

import App from './containers/App';
// Dashboard
import Dashboard from './containers/Dashboard';
// Campaigns
import CreateCampaign from './containers/campaigns/CreateCampaign';
import ManageCampaigns from './components/campaigns/ManageCampaigns';
import CampaignView from './containers/campaigns/CampaignView';
// Templates
import CreateTemplate from './containers/templates/CreateTemplate';
import ManageTemplates from './containers/templates/ManageTemplates';
import TemplateView from './containers/templates/TemplateView';
// Lists
import CreateList from './containers/lists/CreateList';
import ManageLists from './components/lists/ManageLists';
import ManageListSubscribers from './containers/lists/ManageListSubscribers';
// Analytics
import CampaignReports from './containers/analytics/CampaignReports';
// Accounts Management
import CreateAccount from './containers/accountsManagement/CreateAccount';
import DeleteAccount from './containers/accountsManagement/DeleteAccount';
// Permissions
import GrantPermissions from './containers/permissions/GrantPermissions';
import OfferedPermissions from './containers/permissions/OfferedPermissions';
import ReceivedPermissions from './containers/permissions/ReceivedPermissions';
// Settings
import Settings from './containers/Settings';

// import AddEmail from './containers/AddEmail';
import NotFound from './components/404';

function mapStateToProps(state) {
  return {
    activeAccount: state.activeAccount
  };
}

@connect(mapStateToProps, null)
export default class RouterConfig extends Component {

  static propTypes = {
    // redux
    activeAccount: PropTypes.object.isRequired,
    // props
    history: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter(nextState, replace) {
    const accountIsActive = !!this.props.activeAccount.email;
    if (accountIsActive) {
      const urlPathLength = nextState.routes.length;
      if (urlPathLength === 1) { // Is dashboard
        replace('/404');
      } else {
        if (!this.props.activeAccount[nextState.routes[1].path] || this.props.activeAccount[nextState.routes[1].path] === 'none') {
          replace('/404');
        }
      }
    }
  }

  render() {

    const { history } = this.props;

    return (
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Dashboard} onEnter={this.onEnter} />

          <Route path="campaigns" onEnter={this.onEnter} >
            <Route path="create" component={CreateCampaign}/>
            <Route path="manage" component={ManageCampaigns}/>
            <Route path="manage/:slug" component={CampaignView}/>
          </Route>

          <Route path="templates" onEnter={this.onEnter} >
            <Route path="create" component={CreateTemplate}/>
            <Route path="manage" component={ManageTemplates}/>
            <Route path="manage/:slug" component={TemplateView}/>
          </Route>

          <Route path="lists" onEnter={this.onEnter} >
            <Route path="create" component={CreateList}/>
            <Route path="manage" component={ManageLists}/>
            <Route path="manage/:listId" component={ManageListSubscribers}/>
          </Route>

          <Route path="analytics" onEnter={this.onEnter} >
            <Route path="reports" component={CampaignReports}/>
          </Route>

          <Route path="accountsManagement" onEnter={this.onEnter} >
            <Route path="createAccount" component={CreateAccount}/>
            <Route path="deleteAccount" component={DeleteAccount}/>
          </Route>

          <Route path="permissions" onEnter={this.onEnter} >
            <Route path="grant" component={GrantPermissions}/>
            <Route path="offered" component={OfferedPermissions}/>
            <Route path="received" component={ReceivedPermissions}/>
          </Route>

          <Route path="settings" component={Settings} onEnter={this.onEnter} />

          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}
