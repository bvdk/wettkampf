// @flow
import _ from 'lodash'
import React, {Component} from 'react';
import {Route, Switch} from "react-router";
import OfficialDashboardRoute from "./official";
import EventOfficialsTableRoute from "./EventOfficialsTableRoute";

type Props = {
  eventId: string
};

type State = {

}

class EventOfficialsRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId } = this.props;

    return <Switch>
      <Route path={"/events/:eventId/officials/:officialId"} component={ (props) => <OfficialDashboardRoute history={props.history} eventId={_.get(props,'match.params.eventId')} />}/>
      <Route path={"/events/:eventId/officials"} component={(props) => <EventOfficialsTableRoute history={props.history} eventId={eventId} />}/>
    </Switch>;
  }
}

export default EventOfficialsRoute;
