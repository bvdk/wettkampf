// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import EventAthletesRoute from "./EventAthletesRoute";
import NewAthleteRoute from "./NewAthleteRoute";
import ImportAthletesRoute from "./ImportAthletesRoute";

export default (props) => {

  const {match} = props;

  const eventId = props.eventId || _.get(match, 'params.eventId');

  return <Switch>
    <Route path="/events/:eventId/athletes/new" component={() => <NewAthleteRoute eventId={eventId} />} />
    <Route path="/events/:eventId/athletes/import" component={() => <ImportAthletesRoute eventId={eventId} />} />
    <Route path="/events/:eventId/athletes" component={() => <EventAthletesRoute eventId={eventId} />} />
  </Switch>
}
;
