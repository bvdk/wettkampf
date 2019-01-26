// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import Redirect from "./../Redirect";
import EventUpdateRoute from "./eventUpdateRoute";
import EventAthletesRoute from "./athletes";
import EventDashboardRoute from "./EventDashboardRoute";

export default (props) => {

  const {match} = props;

  const eventId = _.get(match, 'params.eventId');

  return <Switch>
    <Route path="/events/:eventId/dashboard" component={() => <EventDashboardRoute eventId={eventId}/>} />
    <Route path="/events/:eventId/edit" component={() => <EventUpdateRoute eventId={eventId} />} />
    <Route path="/events/:eventId/athletes" component={() => <EventAthletesRoute eventId={eventId} />} />
    <Redirect
      from="/events/:eventId"
      to="/events/:eventId/dashboard"
    />
  </Switch>
}
;
