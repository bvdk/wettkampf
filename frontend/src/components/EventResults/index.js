// @flow
import React, {Component} from 'react';
import AttemptsTable from "../AttemptsTable";
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import {withProps} from "recompose";
import _ from "lodash";

type
Props = {
    eventId: string,
    filterParams: any,
    eventResultsQuery: any,
};

type
State = {}

const EventResultsQuery = loader("../../graphql/queries/eventResults.graphql");

class EventResults extends Component<Props, State> {
    _handleResultChange = (res) => {
        this.props.eventResultsQuery.refetch();
    };

    render() {
        const {athletes, loading, filterParams, availableDisciplines} = this.props;
        return <AttemptsTable
            settingsKey={'eventResults'}
            groupWeightClasses
            availableDisciplines={availableDisciplines}
            onChange={this._handleResultChange}
            filterParams={filterParams}
            tableProps={{
                loading,
                scroll: {x: 900}
            }}
            loading={loading}
            athletes={athletes}/>
    }
}

const getFilterParams = (filterParams) => Object.keys(filterParams).map((filterKey) => ({
    value: filterParams[filterKey],
    index: filterKey
}));

export default compose(
    graphql(EventResultsQuery, {
        name: 'eventResultsQuery',
        options: (props: Props) => ({
            pollInterval: 30000,
            variables: {
                eventId: props.eventId,
                filters: getFilterParams(_.get(props, 'filterParams'))
            }
        }),
    }),
    withProps((props) => ({
        loading: _.get(props, 'eventResultsQuery.loading', false),
        eventId: props.eventId,
        onAthleteClick: props.onAthleteClick,
        athletes: _.get(props, 'eventResultsQuery.event.results', [])
    }))
)(EventResults);

