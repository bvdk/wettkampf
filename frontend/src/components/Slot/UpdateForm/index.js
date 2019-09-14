// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { loader } from 'graphql.macro';

import SlotForm from '../Form';
import waitWhileLoading from '../../../hoc/waitWhileLoading';

const Query = loader('../../../graphql/queries/slotForm.graphql');
const Mutation = loader('../../../graphql/mutations/updateSlot.graphql');

type Props = {
  mutation: Function,
  onUpdate: Function,
  slotId: string
};

class SlotUpdateForm extends Component<Props> {
  render() {
    const values = _.get(this.props, 'query.Slot');
    return (
      <SlotForm
        onSubmit={this.props.onUpdate}
        mutation={this.props.mutation}
        formValues={values}
        translateMutationOptions={data => ({
          variables: {
            slotId: this.props.slotId,
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
        id: props.slotId
      }
    })
  }),
  waitWhileLoading('query'),
  graphql(Mutation, {
    name: 'mutation'
  })
)(SlotUpdateForm);
