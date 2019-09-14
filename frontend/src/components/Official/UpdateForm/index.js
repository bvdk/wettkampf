// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { loader } from 'graphql.macro';

import OfficialForm from '../Form';
import waitWhileLoading from '../../../hoc/waitWhileLoading';

const Query = loader('../../../graphql/queries/officialForm.graphql');
const Mutation = loader('../../../graphql/mutations/updateOfficial.graphql');

type Props = {
  mutation: Function,
  onUpdate: Function,
  officialId: string
};

class OfficialUpdateForm extends Component<Props> {
  render() {
    const values = _.get(this.props, 'query.official');
    return (
      <OfficialForm
        onSubmit={this.props.onUpdate}
        mutation={this.props.mutation}
        formValues={values}
        translateMutationOptions={data => ({
          variables: {
            officialId: this.props.officialId,
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
        id: props.officialId
      }
    })
  }),
  waitWhileLoading('query'),
  graphql(Mutation, {
    name: 'mutation'
  })
)(OfficialUpdateForm);
