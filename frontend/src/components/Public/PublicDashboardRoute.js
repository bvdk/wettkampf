// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import { withApollo } from 'react-apollo';
import Redirect from '../../Redirect';
import Dashboard from './Dashboard';
import Settings from './Settings';

const PublicRoute = () => (
  <Switch>
    <Route path="/public/dashboard" component={withApollo(Dashboard)} />
    <Route path="/public/settings/:eventId" component={withApollo(Settings)} />
    <Redirect exact from="/public" to="/public/dashboard" />
  </Switch>
);

export default React.memo(PublicRoute);
