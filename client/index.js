/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
require('./favicon.ico'); // Tell webpack to load favicon.ico
import { syncHistoryWithStore } from 'react-router-redux';

/*eslint-disable no-unused-vars*/
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootStrap from 'bootstrap/dist/js/bootstrap.min.js';
import adminLte from 'admin-lte/dist/js/app.min.js';
import adminLteCss from 'admin-lte/dist/css/AdminLTE.min.css';
import adminLteSkin from 'admin-lte/dist/css/skins/skin-blue.min.css';
/*eslint-enable no-unused-vars*/


import './styles/index.scss';

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
);
