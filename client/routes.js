import React from 'react';
import { Route, IndexRoute } from 'react-router';

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
// Settings
import Settings from './containers/Settings';

// import AddEmail from './containers/AddEmail';
import NotFound from './components/404';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard}/>

    <Route path="campaigns">
      <Route path="create" component={CreateCampaign}/>
      <Route path="manage" component={ManageCampaigns}/>
      <Route path="manage/:slug" component={CampaignView}/>
    </Route>

    <Route path="templates">
      <Route path="create" component={CreateTemplate}/>
      <Route path="manage" component={ManageTemplates}/>
      <Route path="manage/:slug" component={TemplateView}/>
    </Route>

    <Route path="lists">
      <Route path="create" component={CreateList}/>
      <Route path="manage" component={ManageLists}/>
      <Route path="manage/:listId" component={ManageListSubscribers}/>
    </Route>

    <Route path="analytics">
      <Route path="reports" component={CampaignReports}/>
    </Route>

    <Route path="settings" component={Settings}/>

    <Route path="*" component={NotFound}/>
  </Route>
);
