import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import indexRoutes from "routes/index.jsx";
import { Provider } from 'react-redux';
import store from 'store';

import "assets/scss/material-dashboard-pro-react.css?v=1.4.0";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'semantic-ui-css/semantic.min.css';
const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);


