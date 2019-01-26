// @flow
import React, {Component} from 'react';
import AthleteCreateForm from "./../../../components/AthleteCreateForm";
import {withRouter} from "react-router";

type Props = {
  eventId: string,
};

type State = {

}

class EventAthletesRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;

    return <div style={{padding: 10}}>
      <h3>Neuer Athlet</h3>
      <AthleteCreateForm
        eventId={eventId}
        onCreate={()=> history.push(`/events/${eventId}/athletes`)}
      />
    </div>;
  }
}

export default withRouter(EventAthletesRoute);
