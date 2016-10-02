import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Settings from './containers/Settings';
import Home from './containers/Home';
import ImportSubscribers from './containers/ImportSubscribers';
import AddEmail from './containers/AddEmail';
import NotFound from './components/404';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />

    <Route path="campaigns">
    </Route>

    <Route path="lists">
        <Route path="create" component={ImportSubscribers} />
        <Route path="manage" component={AddEmail} />
    </Route>

    <Route path="analytics">
    </Route>

    <Route path="settings" component={Settings} />

    <Route path="*" component={NotFound} />
  </Route>
);
