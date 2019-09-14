// @flow
import React, {Component} from 'react';
import AthleteCreateForm from "../../Athlete/CreateForm";
import {withRouter} from "react-router";
import IfRole from "../../../hoc/ifRole";

type Props = {
  eventId: string,
};

type State = {

}

class EventAthletesRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;

    return <IfRole showError>
      <div style={{padding: 10}}>
        <h3>Neuer Athlet</h3>
        <AthleteCreateForm
            eventId={eventId}
            onCreate={()=> history.push(`/events/${eventId}/athletes`)}
        />
      </div>
    </IfRole>;
  }
}

export default withRouter(EventAthletesRoute);
