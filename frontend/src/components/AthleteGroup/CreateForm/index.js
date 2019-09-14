// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { loader } from 'graphql.macro';

import AthleteGroupForm from '../Form';

const CreateAthleteGroupMutation = loader(
  '../../../graphql/mutations/createAthleteGroup.graphql'
);
const EventAthleteGroupsQuery = loader(
  '../../../graphql/queries/eventAthleteGroups.graphql'
);

type Props = {
  createEventMutation: Function,
  onCreate: Function,
  eventId: string
};

type State = {};

class AthleteGroupCreateForm extends Component<Props, State> {
  render() {
    return (
      <AthleteGroupForm
        onSubmit={this.props.onCreate}
        mutation={this.props.mutation}
        translateMutationOptions={data => ({
          variables: {
            eventId: this.props.eventId,
            data
          }
        })}
      />
    );
  }
}

export default compose(
  graphql(CreateAthleteGroupMutation, {
    name: 'mutation',
    options: props => ({
      refetchQueries: [
        {
          query: EventAthleteGroupsQuery,
          variables: {
            eventId: props.eventId
          }
        }
      ]
    })
  })
)(AthleteGroupCreateForm);
