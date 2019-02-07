// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import EventAthletesRoute from "./EventAthletesRoute";
import NewAthleteRoute from "./NewAthleteRoute";
import ImportAthletesRoute from "./ImportAthletesRoute";
import EventAthleteRoute from "./EventAthleteRoute";

export default (props) => {

  const {match, history} = props;

  const eventId = props.eventId || _.get(match, 'params.eventId');

  return <Switch>
    <Route path="/events/:eventId/athletes/new" component={() => <NewAthleteRoute eventId={eventId} />} />
    <Route path="/events/:eventId/athletes/import" component={() => <ImportAthletesRoute eventId={eventId} />} />
    <Route path="/events/:eventId/athletes/:athleteId" component={({match}) => <EventAthleteRoute history={history} eventId={eventId} athleteId={match.params.athleteId} />} />
    <Route path="/events/:eventId/athletes" component={() => <EventAthletesRoute history={history} eventId={eventId} />} />
  </Switch>
}
;
