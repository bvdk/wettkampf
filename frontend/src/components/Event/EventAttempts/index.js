// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import { withProps } from 'recompose';
import AttemptsTable from '../../AttemptsTable';
import { sortAthletes } from '../../Public/NextAthletes';

type Props = {
  eventId: string,
  filterParams: any,
  eventAttemptsQuery: any
};

const EventAttemptsQuery = loader(
  '../../../graphql/queries/eventAttempts.graphql'
);

class EventAttempts extends Component<Props, {}> {
  _handleAttemptChange = () => {
    this.props.eventAttemptsQuery.refetch();
  };

  render() {
    const {
      athletes,
      availableDisciplines,
      loading,
      filterParams
    } = this.props;

    return (
      <AttemptsTable
        highlightFirstAthlete
        groupWeightClasses
        editableAttemptCols
        onChange={this._handleAttemptChange}
        filterParams={filterParams}
        tableProps={{
          loading,
          scroll: { x: 900 }
        }}
        loading={loading}
        availableDisciplines={availableDisciplines}
        athletes={athletes.sort(sortAthletes)}
      />
    );
  }
}

const getFilterParams = filterParams => {
  const tmp = [];

  if (filterParams.athleteGroupId) {
    tmp.push({
      value: filterParams.athleteGroupId,
      index: 'athleteGroupId'
    });
  }

  if (filterParams.slotId) {
    tmp.push({
      value: filterParams.slotId,
      index: 'slotId'
    });
  }
  return tmp.length ? tmp : null;
};

export default compose(
  graphql(EventAttemptsQuery, {
    name: 'eventAttemptsQuery',
    options: (props: Props) => {
      const discipline = _.get(props, 'filterParams.discipline');
      return {
        fetchPolicy: 'network-first',
        variables: {
          eventId: props.eventId,
          discipline,
          filters: getFilterParams(_.get(props, 'filterParams')),
          sort: discipline
            ? [
                {
                  name: `nextAttemptsSortKeys.${discipline}`,
                  direction: 'ASC'
                }
              ]
            : null
        }
      };
    }
  }),
  withProps(props => ({
    loading: _.get(props, 'eventAttemptsQuery.loading', false),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    availableDisciplines: _.get(
      props,
      'eventAttemptsQuery.event.availableDisciplines',
      []
    ),
    athletes: _.get(props, 'eventAttemptsQuery.event.athletes', [])
  }))
)(EventAttempts);
