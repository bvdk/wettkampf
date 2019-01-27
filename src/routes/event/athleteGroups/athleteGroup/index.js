// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import {Col, Menu, Row} from "antd";
import EventAthleteGroupMenuList from "../../../../components/EventAthleteGroupMenuList";
import {Link} from "react-router-dom";
import EventAthleteGroupDashboardRoute from "./EventAthleteGroupDashboardRoute";
import Toolbar from "@internal/components/Toolbar";

const { SubMenu } = Menu;


export default (props) => {

    const {match} = props;

    const eventId = props.eventId || _.get(match, 'params.eventId');
    const athleteGroupId = _.get(match, 'params.athleteGroupId');

    return <Row  type="flex">
        <Col>
            <Toolbar
                renderLeft={()=><h3>Startgruppen</h3>}
                borderBottom
            />
            <EventAthleteGroupMenuList selectedKey={athleteGroupId} eventId={eventId} renderItem={(athleteGroup)=><Link to={`/events/${eventId}/athleteGroups/${athleteGroup.id}`}>{athleteGroup.name}</Link>}/>
        </Col>
        <Col style={{flexGrow: 1}} >
            <Switch>
                <Route path="/events/:eventId/athleteGroups/:athleteGroupId" component={EventAthleteGroupDashboardRoute} />

            </Switch>
        </Col>
    </Row>
}
;
