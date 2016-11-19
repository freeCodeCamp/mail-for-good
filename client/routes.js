import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';

import Dashboard from './containers/Dashboard';

import CreateCampaign from './containers/campaigns/CreateCampaign';
import ManageCampaigns from './components/campaigns/ManageCampaigns';
import CampaignView from './containers/campaigns/CampaignView';
import Templates from './containers/campaigns/Templates';

import CreateList from './containers/lists/CreateList';
import ManageLists from './components/lists/ManageLists';
import ManageListSubscribers from './containers/lists/ManageListSubscribers';

import CampaignReports from './containers/analytics/CampaignReports';

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
      <Route path="create" component={Templates}/>
      <Route path="manage" component={Templates}/>
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
