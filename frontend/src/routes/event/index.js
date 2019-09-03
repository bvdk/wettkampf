// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import Redirect from "./../Redirect";
import EventUpdateRoute from "./eventUpdateRoute";
import EventAthletesRoute from "./athletes";
import EventAttemptsRoute from "./attempts";

import EventMenu from "../../components/EventDashboard/menu";
import EventSlotsRoute from "./slots";
import EventAthleteGroupsRoute from "./athleteGroups";
import EventResultsRoute from "./results";
import {Col, Grow, Row} from "../../components/Flex";
import EventOfficialsRoute from "./officials";

export default (props) => {
    const {match, history} = props;

    const eventId = _.get(match, 'params.eventId');
    const index = _.get(match, 'params.index');

    return <Row type="flex" style={{flexDirection: 'row', flex: '1 100%'}} className="event-layout">
        <Col className="event-sidebar">
            <EventMenu selectedKey={index} eventId={eventId}/>
        </Col>
        <Grow>
            <Switch>
                <Route path="/events/:eventId/edit" component={() => <EventUpdateRoute eventId={eventId}/>}/>
                <Route path="/events/:eventId/athletes" component={EventAthletesRoute}/>
                <Route path="/events/:eventId/athleteGroups" component={EventAthleteGroupsRoute}/>
                <Route path="/events/:eventId/slots"
                       component={() => <EventSlotsRoute history={history} eventId={eventId}/>}/>
                <Route path="/events/:eventId/attempts"
                       component={(props) => <EventAttemptsRoute history={_.get(props, 'history')}
                                                                 eventId={eventId}/>}/>
                <Route path="/events/:eventId/results"
                       component={(props) => <EventResultsRoute history={_.get(props, 'history')} eventId={eventId}/>}/>
                <Route path="/events/:eventId/officials"
                       component={(props) => <EventOfficialsRoute history={_.get(props, 'history')}
                                                                  eventId={eventId}/>}/>
                <Redirect
                    from="/events/:eventId"
                    to="/events/:eventId/athletes"
                />
            </Switch>
        </Grow>
    </Row>
}
