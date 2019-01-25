// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import Redirect from "./Redirect";
import EventsDashboardRoute from "./events/eventsDashboard";
import EventUpdateForm from "./../components/EventUpdateForm";
import EventUpdateRoute from "./events/eventUpdateRoute";

export default () => (
  <Switch>
    <Route exact path="/events" component={EventsDashboardRoute} />
    <Route exact path="/events/:eventId/edit" component={EventUpdateRoute} />
    <Redirect
      from="/events/:eventId"
      to="/events/:eventId/athletes"
    />
    <Redirect exact path="/" to="/events" />
  </Switch>
);
