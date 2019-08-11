// @flow
import React, {Component} from 'react';
import {compose, graphql} from "react-apollo";
import {loader} from 'graphql.macro';

import AthleteForm from "../AthleteForm";

const CreateAthleteMutation = loader("../../graphql/mutations/createAthlete.graphql");
const EventAthletesQuery = loader("../../graphql/queries/eventAthletesQuery.graphql");

type Props = {
  createEventMutation: Function,
  onCreate: Function,
  eventId: string,
};

type State = {

}

class AthleteCreateForm extends Component<Props, State> {
  componentDidMount() {}


  render() {

    return <AthleteForm
      onSubmit={this.props.onCreate}
      mutation={this.props.mutation}
      translateMutationOptions={(data) => ({
        variables: {
          eventId: this.props.eventId,
          data
        },
      })}
    />;
  }
}

export default compose(
  graphql(CreateAthleteMutation, {
    name: 'mutation',
    options: (props) => ({
      refetchQueries: [{
        query: EventAthletesQuery,
        variables: {
          eventId: props.eventId
        }
      }]
    })
  }),
)(AthleteCreateForm);
