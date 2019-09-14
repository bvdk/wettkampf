// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import _ from 'lodash';
import SlotRoute from './Slot';
import EventSlots from '../../Slots/EventSlots';

export default props => {
  const { match } = props;

  const eventId = props.eventId || _.get(match, 'params.eventId');

  return (
    <Switch>
      <Route path="/events/:eventId/slots/:slotId" component={SlotRoute} />
      <Route
        path="/events/:eventId/slots"
        component={routerProps => (
          <EventSlots
            onSlotClick={slot =>
              routerProps.history.push(`/events/${eventId}/slots/${slot.id}`)
            }
            eventId={eventId}
          />
        )}
      />
    </Switch>
  );
};
