// @flow
import React, { Component } from 'react';
import _ from "lodash";
import EventAthleteGroupDashboard from "../../../../components/EventAthleteGroupDashboard";

type Props = {
    eventId: string,
};

export default class EventAthleteGroupRoute extends Component<Props> {
    props: Props;

    render() {
        const { match } = this.props;

        const eventId = this.props.eventId || _.get(match, 'params.eventId');
        const athleteGroupId = _.get(match, 'params.athleteGroupId');

        return (
            <div>
                <EventAthleteGroupDashboard  eventId={eventId} athleteGroupId={athleteGroupId}/>
            </div>
        );
    }
}
