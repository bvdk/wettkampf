// @flow
import React, {Component} from 'react';
import {Route, Switch} from "react-router";
import OfficialDashboardRoute from "./official";
import EventOfficialsTableRoute from "./EventOfficialsTableRoute";
import EventOfficialCreateRoute from "./EventOfficialCreateRoute";

type Props = {
    eventId: string
};

type State = {};

class EventOfficialsRoute extends Component<Props, State> {
    render() {
        const {eventId} = this.props;

        return <Switch>
            <Route path={"/events/:eventId/officials/new"}
                   component={(props) => <EventOfficialCreateRoute history={props.history} eventId={eventId}/>}/>
            <Route path={"/events/:eventId/officials/:officialId"}
                   component={(props) => <OfficialDashboardRoute history={props.history} eventId={eventId}/>}/>
            <Route path={"/events/:eventId/officials"}
                   component={(props) => <EventOfficialsTableRoute history={props.history} eventId={eventId}/>}/>
        </Switch>;
    }
}

export default EventOfficialsRoute;
