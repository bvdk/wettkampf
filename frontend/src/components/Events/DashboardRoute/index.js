// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

type Props = {
  events: Event[],
  history: {
    push: Function
  },
  addEvent: (event: Event) => void
};

type State = {};

class EventsDashboardRoute extends Component<Props, State> {
  render() {
    const { events, addEvent, history } = this.props;

    return (
      <Dashboard
        events={events}
        onClickEvent={event => history.push(`/events/${event.id}`)}
        onAddEvent={addEvent}
      />
    );
  }
}

export default withRouter(EventsDashboardRoute);
