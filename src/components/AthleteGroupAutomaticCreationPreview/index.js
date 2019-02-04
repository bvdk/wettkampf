// @flow
import React, {Component} from 'react';
import _ from "lodash";
import {compose, mapProps} from "recompose";
import {graphql} from "react-apollo";
import {loader} from "graphql.macro";
import AthleteGroupTable from "../AthleteGroupTable";
import Toolbar from "../Toolbar";
import {Button} from "antd";

const AutoCreateAthleteGroupsPreviewQuery = loader("../../graphql/queries/autoCreateAthleteGroupsPreview.graphql");
const AutoCreateAthleteGroupsMutation = loader("../../graphql/mutations/autoCreateAthleteGroups.graphql");

type Props = {
    eventId: string,
    options: any,
};

type State = {
    loading: boolean
}

class AthleteGroupAutomaticCreationPreview extends Component<Props> {
    props: Props;

    state = {
        loading: false,
    };

    _handleClick = () => {

    }

    render() {

        const {athleteGroups, eventId} = this.props;
        const {loading} = this.state;

        return (
            <div>
                <AthleteGroupTable
                    hideKey={'action'}
                    eventId={eventId}
                    tableProps={{
                        footer: () => <Toolbar renderRight={() => <Button type={'primary'} onClick={this._handleClick} loading={loading}>Startgruppen erstellen</Button>}/>
                    }}
                    athleteGroups={athleteGroups}
                    editable={false}/>
            </div>
        );
    }
}

export default compose(
    graphql(AutoCreateAthleteGroupsPreviewQuery,{
        name: 'autoCreateAthleteGroupsPreviewQuery',
        skip: (props) => !props.options,
        options: ({eventId, options}: Props) => ({
            variables: {
                eventId,
                keys: options.keys,
                useExisting: options.useExisting,
                maxGroupSize: options.maxGroupSize,
            }
        })
    }),
    mapProps((props) => ({
        eventId: props.eventId,
        loading: _.get(props,'autoCreateAthleteGroupsPreviewQuery.loading',false),
        athleteGroups:  _.get(props,'autoCreateAthleteGroupsPreviewQuery.autoCreateAthleteGroupsPreview.athleteGroups',[]),
    }))
)(AthleteGroupAutomaticCreationPreview)