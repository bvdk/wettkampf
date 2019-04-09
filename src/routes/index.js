// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import Redirect from "./Redirect";
import EventsDashboardRoute from "./events/eventsDashboard";
import EventRoute from "./event";

const Routes = () => (
  <Switch>
        <Route path="/events/:eventId/:index" component={EventRoute} />
        <Route path="/events/:eventId" component={EventRoute} />
        <Route path="/events" component={EventsDashboardRoute} />
        <Redirect exact path="/" to="/events" />
  </Switch>
)

export default Routes;
