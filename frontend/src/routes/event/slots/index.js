// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import EventSlotsTableRoute from "./EventSlotsTableRoute";
import EventSlotRoute from "./slot";

export default (props) => {

    const {match} = props;

    const eventId = props.eventId || _.get(match, 'params.eventId');

    return <Switch>
        <Route path="/events/:eventId/slots/:slotId" component={EventSlotRoute} />
        <Route path="/events/:eventId/slots" component={() => <EventSlotsTableRoute eventId={eventId} />} />
    </Switch>
}
;
