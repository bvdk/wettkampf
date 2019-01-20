// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import Redirect from "./Redirect";
import EventsDashboardRoute from "./eventsDashboard";

export default () => (
  <Switch>
    <Route exact path="/events" component={EventsDashboardRoute} />
    <Redirect
      from="/events/:eventId"
      to="/events/:eventId/athletes"
    />
    <Redirect exact path="/" to="/events" />
  </Switch>
);
