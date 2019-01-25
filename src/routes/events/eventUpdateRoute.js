// @flow
import React, { Component } from 'react';
import EventUpdateForm from "../../components/EventUpdateForm";
import _ from "lodash";

type Props = {
  match: any,
};

type State = {

}

class EventUpdateRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { match } = this.props;

    const eventId = _.get(match, 'params.eventId')

    return <div style={{padding: 10}}>
      <h3>Event bearbeiten</h3>
      <EventUpdateForm eventId={eventId}/>
    </div>;
  }
}

export default EventUpdateRoute;
