// @flow
import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import EventsDashboard from "../../components/EventsDashboard";

type Props = {
  events: Event[],
  history: {
    push: Function,
  },
  addEvent: (event: Event) => void,
};

type State = {

};


class EventsDashboardRoute extends Component<Props, State> {
  componentDidMount() {}


  render() {

    const {events, addEvent, history} = this.props;

    return ( <EventsDashboard
      events={events}
      onClickEvent={(event)=>{
        console.log('onClickEvent',event);
        history.push(`/events/${event.id}`)
      }}
      onAddEvent={addEvent}
    /> );
  }
}

export default withRouter(EventsDashboardRoute);

