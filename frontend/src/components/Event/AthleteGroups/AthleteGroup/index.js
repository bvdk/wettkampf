// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import EventAthleteGroupDashboardRoute from './EventAthleteGroupDashboardRoute';
import EventAthleteGroupFormRoute from './EventAthleteGroupFormRoute';

export default () => (
  <Switch>
    <Route
      path="/events/:eventId/athleteGroups/:athleteGroupId/edit"
      component={EventAthleteGroupFormRoute}
    />
    <Route
      path="/events/:eventId/athleteGroups/:athleteGroupId"
      component={EventAthleteGroupDashboardRoute}
    />
  </Switch>
);
