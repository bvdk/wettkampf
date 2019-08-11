// @flow
import React, {Component} from 'react';
import EventSlots from "../../../components/EventSlots";
import {withRouter} from "react-router";

type Props = {};

class EventSlotsTableRoute extends Component<Props> {
    props: Props;

    render() {

        const {eventId, history} = this.props;

        return (
            <EventSlots onSlotClick={(slot)=> history.push(`/events/${eventId}/slots/${slot.id}`)} eventId={eventId} />
        );
    }
}

export default withRouter(EventSlotsTableRoute);