// @flow
import React, { Component } from 'react';
import EventUpdateForm from "../../components/EventUpdateForm";
import _ from "lodash";
import IfRole from "../../hoc/ifRole";

type Props = {
  eventId: any,
};

type State = {

}

class EventUpdateRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId } = this.props;

    return <IfRole showError>
      <div style={{padding: 10}}>
        <h3>Wettkampf bearbeiten</h3>
        <EventUpdateForm eventId={eventId}/>
      </div>
    </IfRole>;
  }
}

export default EventUpdateRoute;
