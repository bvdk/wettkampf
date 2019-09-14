// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import _ from 'lodash';
import Redirect from '../../Redirect';

import EventAthleteGroupsRoute from './AthleteGroups';
import EventAthletesRoute from './Athletes';
import EventAttemptsRoute from './Attempts';
import EventOfficialsRoute from './Officials';
import EventResultsRoute from './ResultsRoute';

import { Col, Grow, Row } from '../Flex';
import Menu from './Dashboard/menu';
import SlotsRoute from './Slots';
import UpdateRoute from './UpdateRoute';

export default props => {
  const { match, history } = props;

  const eventId = _.get(match, 'params.eventId');
  const index = _.get(match, 'params.index');

  return (
    <Row
      type="flex"
      style={{ flexDirection: 'row', flex: '1 100%' }}
      className="event-layout">
      <Col className="event-sidebar">
        <Menu selectedKey={index} eventId={eventId} />
      </Col>
      <Grow>
        <Switch>
          <Route
            path="/events/:eventId/edit"
            component={() => <UpdateRoute eventId={eventId} />}
          />
          <Route
            path="/events/:eventId/athletes"
            component={EventAthletesRoute}
          />
          <Route
            path="/events/:eventId/athleteGroups"
            component={EventAthleteGroupsRoute}
          />
          <Route
            path="/events/:eventId/slots"
            component={() => <SlotsRoute history={history} eventId={eventId} />}
          />
          <Route
            path="/events/:eventId/attempts"
            component={routeProps => (
              <EventAttemptsRoute
                history={_.get(routeProps, 'history')}
                eventId={eventId}
              />
            )}
          />
          <Route
            path="/events/:eventId/results"
            component={routeProps => (
              <EventResultsRoute
                history={_.get(routeProps, 'history')}
                eventId={eventId}
              />
            )}
          />
          <Route
            path="/events/:eventId/officials"
            component={routeProps => (
              <EventOfficialsRoute
                history={_.get(routeProps, 'history')}
                eventId={eventId}
              />
            )}
          />
          <Redirect from="/events/:eventId" to="/events/:eventId/athletes" />
        </Switch>
      </Grow>
    </Row>
  );
};
