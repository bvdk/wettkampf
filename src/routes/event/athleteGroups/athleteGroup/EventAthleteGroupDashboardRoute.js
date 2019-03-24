// @flow
import React, { Component } from 'react';
import {Tabs, Panel} from "antd";
import _ from "lodash";
import styled from "styled-components";
import EventAthleteGroupDashboard from "../../../../components/EventAthleteGroupDashboard";

const TabPane = Tabs.TabPane;

type Props = {
    eventId: string,
};

const Wrapper = styled.div`
    padding: 10px;
`

export default class EventAthleteGroupRoute extends Component<Props> {
    props: Props;

    render() {

        const { match, history } = this.props;

        const eventId = this.props.eventId || _.get(match, 'params.eventId');
        const athleteGroupId = _.get(match, 'params.athleteGroupId');

        return (
            <div>
                <EventAthleteGroupDashboard  eventId={eventId} athleteGroupId={athleteGroupId}/>
            </div>
        );
    }
}
