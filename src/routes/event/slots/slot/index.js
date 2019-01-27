// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import {Col, Menu, Row} from "antd";
import EventSlotMenuList from "../../../../components/EventSlotMenuList";
import {Link} from "react-router-dom";

const { SubMenu } = Menu;


export default (props) => {

    const {match} = props;

    const eventId = props.eventId || _.get(match, 'params.eventId');
    const slotId = _.get(match, 'params.slotId');

    return <Row  type="flex">
        <Col style={{minWidth: 150}}>
            <h3 style={{padding: '10px 10px 0'}}>Bühnen</h3>
            <hr/>
            <EventSlotMenuList selectedKey={slotId} eventId={eventId} renderItem={(slot)=><Link to={`/events/${eventId}/slots/${slot.id}`}>{slot.name}</Link>}/>
        </Col>
        <Col style={{flexGrow: 1}}>
            <Switch>
                <Route path="/events/:eventId/slots/:slotId" component={() => <div>TODO</div>} />

            </Switch>
        </Col>
    </Row>
}
;
