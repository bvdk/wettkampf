// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { loader } from 'graphql.macro';

import AthleteGroupForm from '../Form';
import waitWhileLoading from '../../../hoc/waitWhileLoading';

const Query = loader('../../../graphql/queries/athleteGroupForm.graphql');
const Mutation = loader(
  '../../../graphql/mutations/updateAthleteGroup.graphql'
);

type Props = {
  mutation: Function,
  onUpdate: Function,
  athleteGroupId: string
};

class AthleteGroupUpdateForm extends Component<Props> {
  render() {
    const values = _.get(this.props, 'query.athleteGroup');
    return (
      <AthleteGroupForm
        onSubmit={this.props.onUpdate}
        mutation={this.props.mutation}
        formValues={values}
        translateMutationOptions={data => ({
          variables: {
            athleteGroupId: this.props.athleteGroupId,
            data
          }
        })}
      />
    );
  }
}

export default compose(
  graphql(Query, {
    name: 'query',
    options: (props: Props) => ({
      variables: {
        id: props.athleteGroupId
      }
    })
  }),
  waitWhileLoading('query'),
  graphql(Mutation, {
    name: 'mutation'
  })
)(AthleteGroupUpdateForm);
