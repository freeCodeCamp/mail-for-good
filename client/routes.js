import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Settings from './containers/Settings';

export default (
  <Route path="/" component={App}>
    <Route path="settings" component={Settings} />
  </Route>
);
