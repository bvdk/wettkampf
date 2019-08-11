// @flow
import React, { Component } from 'react';
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {withProps} from "recompose";
import _ from "lodash";
import {Menu} from "antd";

const CreateSlotMutation = loader("../../graphql/mutations/createSlot.graphql");
const EventSlotsQuery = loader("../../graphql/queries/eventSlots.graphql");

type Props = {
    eventId: string,
    selectedKey: string,
    onClick?: Function,
    renderItem?: Function,
};

class EventSlotMenuList extends Component<Props> {
    props: Props;

    render() {

        const {slots, onClick, renderItem, selectedKey} = this.props;
        return (
            <Menu
                selectedKeys={[selectedKey]}
            >
                {slots.map(slot => <Menu.Item key={slot.id} onClick={onClick}>{
                    renderItem ? renderItem(slot) : slot.name
                }</Menu.Item>)}
            </Menu>
        );
    }
}

export default compose(
    graphql(CreateSlotMutation,{
        name: 'createMutation',
        options: ({eventId}: Props) => ({
            variables: {
                eventId,
                data: {}
            },
            refetchQueries: [{
                query: EventSlotsQuery,
                variables: {
                    eventId
                }
            }]
        })
    }),
    graphql(EventSlotsQuery, {
        name: 'query',
        options: (props: Props) =>({
            variables: {
                eventId: props.eventId
            }
        }),
    }),
    waitWhileLoading('query'),
    withProps((props)=>({
        slots: _.get(props,'query.event.slots',[])
    }))
)(EventSlotMenuList);