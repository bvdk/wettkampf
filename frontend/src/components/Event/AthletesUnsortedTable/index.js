// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { loader } from 'graphql.macro';
import _ from 'lodash';
import waitWhileLoading from '../../../hoc/waitWhileLoading';
import AthletesTable from '../../AthletesTable';

const AthleteGroupAthletesQuery = loader(
  '../../../graphql/queries/eventAthletesUnsorted.graphql'
);

type Props = {
  onSelectChange?: Function
};

class EventAthletesUnsortedTable extends Component<Props> {
  props: Props;

  render() {
    const { eventAthletesUnsortedQuery, onSelectChange } = this.props;
    const athletes = _.get(
      eventAthletesUnsortedQuery,
      'event.unsortedAthletes',
      []
    );

    return (
      <AthletesTable
        hideKeys={['athleteGroup.name', 'athleteGroup.slot.name']}
        onSelectChange={onSelectChange}
        athletes={athletes}
      />
    );
  }
}
export default compose(
  graphql(AthleteGroupAthletesQuery, {
    name: 'eventAthletesUnsortedQuery',
    options: (props: Props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
  waitWhileLoading('eventAthletesUnsortedQuery')
)(EventAthletesUnsortedTable);
