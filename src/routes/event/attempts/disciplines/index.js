// @flow
import React, {Component} from 'react';
import Toolbar from "../../../../components/Toolbar";
import EventAttempts from "../../../../components/EventAttempts";

type Props = {
  eventId: string,
  discipline: string,
  availableDisciplines: string[],
};

type State = {

}

class EventAttemptsDisciplineRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, discipline } = this.props;

    return <div>

      <hr/>
      <EventAttempts discipline={discipline} eventId={eventId}/>
    </div>;
  }
}

export default EventAttemptsDisciplineRoute;
