// @flow
import React, { Component } from 'react';
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import Toolbar from "../Toolbar";
import {Link} from "react-router-dom";
import {Button} from "antd";

import AthleteGroupTable from "./../AthleteGroupTable";

const EventAthleteGroupsQuery = loader("../../graphql/queries/eventAthleteGroups.graphql");


type Props = {
    eventId: string,
    onClickAthleteGroup: Function
};

class EventAthleteGroupsDashboard extends Component<Props> {
    props: Props;

    render() {

        const {eventId, athleteGroups, onClickAthleteGroup} = this.props;
        return (
            <div>
                <Toolbar
                    renderLeft={() => <h3>Startgruppen</h3>}
                    renderRight={()=> <Link to={`/events/${eventId}/athleteGroups/new`}><Button>Erstellen</Button></Link>}
                />
                <AthleteGroupTable
                    editable
                    eventId={eventId}
                    athleteGroups={athleteGroups}
                    onClick={onClickAthleteGroup}
                />
            </div>
        );
    }
}

export default compose(
    graphql(EventAthleteGroupsQuery, {
        name: 'eventAthleteGroupsQuery',
        options: (props: Props) =>({
            variables: {
                eventId: props.eventId
            }
        }),
    }),
    waitWhileLoading('eventAthleteGroupsQuery'),
    mapProps((props)=>({
        eventId: props.eventId,
        onClickAthleteGroup: props.onClickAthleteGroup,
        athleteGroups: _.get(props,'eventAthleteGroupsQuery.event.athleteGroups',[])
    }))
)(EventAthleteGroupsDashboard);
