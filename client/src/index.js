import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'store';
import indexRoutes from "./routes/index.jsx";
import './index.css';
import * as serviceWorker from './serviceWorker';
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
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
