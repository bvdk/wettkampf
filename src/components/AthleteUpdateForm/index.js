// @flow
import React, {Component} from 'react';
import {compose, graphql} from "react-apollo";
import _ from 'lodash'
import {loader} from 'graphql.macro';

import AthleteForm from "../AthleteForm";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {withProps} from "recompose";

const UpdateAthleteMutation = loader("../../graphql/mutations/updateAthlete.graphql");
const AthleteQuery = loader("../../graphql/queries/athleteForm.graphql");


type Props = {
  mutation: Function,
  onUpdate: Function,
  athleteId: string,
};

type State = {

}

class AthleteUpdateForm extends Component<Props, State> {

  render() {

    return <AthleteForm
      formValues={this.props.athlete}
      onSubmit={this.props.onUpdate}
      mutation={this.props.mutation}
      translateMutationOptions={(data) => ({
        variables: {
          id: this.props.athleteId,
          data
        },
      })}
    />;
  }
}

export default compose(
  graphql(AthleteQuery,{
    name: 'athleteQuery',
    options: (props) => ({
      variables: {
        id: props.athleteId
      }
    })
  }),
  waitWhileLoading('athleteQuery'),
  graphql(UpdateAthleteMutation, {
    name: 'mutation',
  }),
  withProps((props)=>({
    athlete: _.get(props,'athleteQuery.athlete')
  }))
)(AthleteUpdateForm);
