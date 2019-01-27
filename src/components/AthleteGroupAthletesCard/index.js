// @flow
import React, { Component } from 'react';
import AthleteGroupsAthletesTable from "../AthleteGroupsAthletesTable";
import {Badge, Button, Card, Modal, message} from "antd";
import _ from "lodash";
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import EventAthletesUnsortedTable from "./../EventAthletesUnsortedTable";

const AthleteGroupAthletesQuery = loader("../../graphql/queries/athleteGroupAthletes.graphql");
const EventAthletesUnsortedQuery = loader("../../graphql/queries/eventAthletesUnsorted.graphql");
const AddAthletesToAthleteGroupMutation = loader("../../graphql/mutations/addAthletesToAthleteGroup.graphql");


type Props = {
    athleteGroupId: string,
    eventId: string,
    addAthletesToAthleteGroupMutation: Function,
};

type State = {
    visible: boolean
}

class AthleteGroupAthletesCard extends Component<Props> {

    state = {
        visible: false,
        loadingSync: false,
        selectedAthleteIds: []
    }

    props: Props;

    _handleSelectChange = (selectedAthleteIds) => {
        this.setState({
            selectedAthleteIds,
        })
    }

    setLoading = (loadingSync) => {
        return new Promise((resolve)=>{
            this.setState({
                loadingSync,
            },() => {
                resolve();
            })
        })
    }
    _handleSync = () => {

        const {athleteGroupId} = this.props;
        const {selectedAthleteIds} = this.state;

        this.setLoading(true)
            .then(() => this.props.addAthletesToAthleteGroupMutation({
                variables: {
                    athleteGroupId,
                    athleteIds: selectedAthleteIds,
                }
            }) )
            .then(() => {
                message.success("Erfolgreich eingetragen")
            })
            .catch(() => {
                message.error("Aktion konnte nicht durchgeführt werden.")
            })
            .finally(() => this.setLoading(false).then(() => this.setState({visible: false})))


    }

    render() {

        const {athleteGroupId, eventAthletesUnsortedQuery, eventId} = this.props;
        const {loadingSync, selectedAthleteIds} = this.state;

        const unsortedAthletes = _.get(eventAthletesUnsortedQuery,'event.unsortedAthletes',[]);

        return (
            <Card
                title={'Athleten'}
                extra={
                    <Badge count={_.size(unsortedAthletes)}>
                        <Button onClick={()=>this.setState({visible: true})}>Athleten verknüpfen</Button>
                        <Modal
                            bodyStyle={{padding: 0}}
                            title="Athleten verknüpfen"
                            visible={this.state.visible}
                            okText={"Athleten in Startgruppe einfügen"}
                            okButtonProps={{
                                loading: loadingSync,
                                disabled: !selectedAthleteIds.length
                            }}
                            onOk={this._handleSync}
                            onCancel={()=>this.setState({visible: false})}
                        >
                            <EventAthletesUnsortedTable onSelectChange={this._handleSelectChange} eventId={eventId} />
                        </Modal>
                    </Badge>}
                bodyStyle={{padding: 0}}>
                <AthleteGroupsAthletesTable athleteGroupId={athleteGroupId} />
            </Card>
        );
    }
}


export default compose(
    graphql(AddAthletesToAthleteGroupMutation,{
        name: 'addAthletesToAthleteGroupMutation',
        options: (props) => ({
            refetchQueries: [{
                query: EventAthletesUnsortedQuery,
                variables: {
                    eventId: props.eventId
                }
            },{
                query: AthleteGroupAthletesQuery,
                variables: {
                    id: props.athleteGroupId
                }
            }]
        })
    }),
    graphql(EventAthletesUnsortedQuery, {
        name: 'eventAthletesUnsortedQuery',
        options: (props: Props) => ({
            variables: {
                eventId: props.eventId
            }
        })
    }),
    waitWhileLoading('eventAthletesUnsortedQuery')
)(AthleteGroupAthletesCard)