import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Settings from './containers/Settings';
import Home from './containers/Home';
import ImportSubscribers from './containers/ImportSubscribers';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="settings" component={Settings} />
    <Route path="import-subscribers" component={ImportSubscribers} />
  </Route>
);
