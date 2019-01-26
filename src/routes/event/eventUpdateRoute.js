// @flow
import React, { Component } from 'react';
import EventUpdateForm from "../../components/EventUpdateForm";
import _ from "lodash";

type Props = {
  eventId: any,
};

type State = {

}

class EventUpdateRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId } = this.props;

    return <div style={{padding: 10}}>
      <h3>Wettkampf bearbeiten</h3>
      <EventUpdateForm eventId={eventId}/>
    </div>;
  }
}

export default EventUpdateRoute;
