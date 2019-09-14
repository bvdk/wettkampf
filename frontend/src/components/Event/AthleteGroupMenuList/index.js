// @flow
import React, {Component} from 'react';
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../../hoc/waitWhileLoading";
import {withProps} from "recompose";
import _ from "lodash";
import {Menu} from "antd";

const CreateAthleteGroupMutation = loader("../../graphql/mutations/createAthleteGroup.graphql");
const EventAthleteGroupsQuery = loader("../../graphql/queries/eventAthleteGroups.graphql");

type Props = {
    eventId: string,
    selectedKey: string,
    onClick?: Function,
    renderItem?: Function,
};

class EventAthleteGroupMenuList extends Component<Props> {
    props: Props;

    render() {

        const {athleteGroups, onClick, renderItem, selectedKey} = this.props;
        return (
            <Menu
                selectedKeys={[selectedKey]}
            >
                {athleteGroups.map(athleteGroup => <Menu.Item key={athleteGroup.id} onClick={onClick}>{
                    renderItem ? renderItem(athleteGroup) : athleteGroup.name
                }</Menu.Item>)}
            </Menu>
        );
    }
}

export default compose(
    graphql(CreateAthleteGroupMutation, {
        name: 'createMutation',
        options: ({eventId}: Props) => ({
            variables: {
                eventId,
                data: {}
            },
            refetchQueries: [{
                query: EventAthleteGroupsQuery,
                variables: {
                    eventId
                }
            }]
        })
    }),
    graphql(EventAthleteGroupsQuery, {
        name: 'query',
        options: (props: Props) => ({
            variables: {
                eventId: props.eventId
            }
        }),
    }),
    waitWhileLoading('query'),
    withProps((props) => ({
        athleteGroups: _.get(props, 'query.event.athleteGroups', [])
    }))
)(EventAthleteGroupMenuList);
