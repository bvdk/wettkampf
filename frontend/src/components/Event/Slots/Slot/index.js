// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import _ from 'lodash';
import SlotDashboard from '../../../Slot/Dashboard';

export default props => {
  const { match } = props;

  const eventId = props.eventId || _.get(match, 'params.eventId');
  const slotId = _.get(match, 'params.slotId');

  return (
    <Switch>
      <Route
        path="/events/:eventId/slots/:slotId"
        component={() => <SlotDashboard slotId={slotId} eventId={eventId} />}
      />
    </Switch>
  );
};
