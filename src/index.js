import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import 'babel-polyfill';
import './styles/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import configureStore from './redux/store/configureStore';
import routes from './routes';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app'),
);
