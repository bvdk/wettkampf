// @flow
import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import EventsDashboard from "../../components/EventsDashboard";
import EventDashboard from "../../components/EventDashboard";

type Props = {
  eventId: string,
};

type State = {

};


class EventDashboardRoute extends Component<Props, State> {
  componentDidMount() {}


  render() {

    const {eventId} = this.props;

    return ( <div>
      <EventDashboard eventId={eventId}/>
    </div> );
  }
}

export default withRouter(EventDashboardRoute);

