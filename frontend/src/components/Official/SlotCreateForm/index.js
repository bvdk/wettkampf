// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { graphql, compose } from 'react-apollo';
import AttributesInlineForm from '../../Form/attributes-inline-form';
import { attributes } from '../Form';

const OfficialSlotCreateMutation = loader(
  '../../../graphql/mutations/createOfficialSlot.graphql'
);
const OfficialSlotsQuery = loader(
  '../../../graphql/queries/slotOfficialSlots.graphql'
);

type Props = {
  slotId: string,
  eventId: string,
  onCreate?: Function
};

class OfficialSlotCreateForm extends Component<Props, {}> {
  render() {
    const { createMutation, slotId, eventId } = this.props;

    return (
      <AttributesInlineForm
        useSubmit
        mutation={createMutation}
        translateMutationOptions={input => {
          return {
            variables: {
              slotId,
              officialId: input.officialId,
              input: {
                position: input.position
              }
            }
          };
        }}
        onSubmit={this.props.onCreate}
        attributes={[
          {
            index: 'officialId',
            inputType: 'select',
            entityType: 'EventOfficial',
            getQueryVariables: () => ({
              eventId
            }),
            type: 'string',
            name: 'Kampfrichter',
            rules: [
              {
                name: 'required'
              }
            ]
          },
          {
            ..._.find(attributes, { index: 'position' })
          }
        ]}
      />
    );
  }
}

export default compose(
  graphql(OfficialSlotCreateMutation, {
    name: 'createMutation',
    options: (props: Props) => ({
      variables: {
        slotId: props.slotId
      },
      refetchQueries: [
        {
          query: OfficialSlotsQuery,
          variables: {
            id: props.slotId
          }
        }
      ]
    })
  })
)(OfficialSlotCreateForm);
