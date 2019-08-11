// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
// import {Button, Col, Row} from "antd";
// import EventSlotMenuList from "../../../../components/EventSlotMenuList";
// import {Link} from "react-router-dom";
import SlotDashboardRoute from "./SlotDashboardRoute";
// import Toolbar from "../../../../components/Toolbar";

export default (props) => {

    const {match} = props;

    const eventId = props.eventId || _.get(match, 'params.eventId');
    const slotId = _.get(match, 'params.slotId');

    return <Switch>
        <Route path="/events/:eventId/slots/:slotId" component={() => <SlotDashboardRoute slotId={slotId} eventId={eventId} />} />

    </Switch>

    // return <Row  type="flex">
    //     <Col style={{minWidth: 150}}>
    //         <Toolbar
    //             renderLeft={() => <h3>Bühnen</h3>}
    //             renderRight={() => <Link to={`/events/${eventId}/slots/new`}><Button icon={'plus'}/></Link>}
    //           borderBottom={true}/>
    //
    //         <EventSlotMenuList selectedKey={slotId} eventId={eventId} renderItem={(slot)=><Link to={`/events/${eventId}/slots/${slot.id}`}>{slot.name}</Link>}/>
    //     </Col>
    //     <Col style={{flexGrow: 1}}>
    //         <Switch>
    //             <Route path="/events/:eventId/slots/:slotId" component={() => <SlotDashboardRoute slotId={slotId} eventId={eventId} />} />
    //
    //         </Switch>
    //     </Col>
    // </Row>
}
;
