// @flow
import React, { Component } from 'react';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import { withProps } from 'recompose';
import _ from 'lodash';
import AttemptsTable from '../../AttemptsTable';

type Props = {
  eventId: string,
  filterParams: any,
  eventResultsQuery: any
};

const EventResultsQuery = loader(
  '../../../graphql/queries/eventResults.graphql'
);

class EventResults extends Component<Props, {}> {
  _handleResultChange = () => {
    this.props.eventResultsQuery.refetch();
  };

  render() {
    const {
      athletes,
      loading,
      filterParams,
      availableDisciplines,
      athleteGroups
    } = this.props;
    return (
      <AttemptsTable
        settingsKey={'eventResults'}
        groupWeightClasses
        availableDisciplines={availableDisciplines}
        onChange={this._handleResultChange}
        filterParams={filterParams}
        tableProps={{
          loading,
          scroll: { x: 900 }
        }}
        loading={loading}
        athletes={athletes}
        athleteGroups={athleteGroups}
      />
    );
  }
}

const getFilterParams = filterParams =>
  Object.keys(filterParams).map(filterKey => ({
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
    })
  }),
  withProps(props => ({
    loading: _.get(props, 'eventResultsQuery.loading', false),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    athletes: _.get(props, 'eventResultsQuery.event.results', []),
    athleteGroups: _.get(props, 'eventResultsQuery.event.athleteGroups', [])
  }))
)(EventResults);
