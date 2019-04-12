// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import Redirect from "./Redirect";
import EventsDashboardRoute from "./events/eventsDashboard";
import EventRoute from "./event";
import EventResultsRoute from "./event/results";
import _ from "lodash";

const Routes = () => (
  <Switch>
        <Route path="/events/:eventId/:index" component={EventRoute} />
        <Route path="/events/:eventId" component={EventRoute} />
        <Route path="/events" component={EventsDashboardRoute} />
        <Route path="/fullscreen/events/:eventId/results" component={(props) => <EventResultsRoute isFullscreen={true} history={_.get(props,'history')} eventId={props.match.params.eventId} />} />
        <Redirect exact path="/" to="/events" />
  </Switch>
)

export default Routes;
