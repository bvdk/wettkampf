// @flow
import React, { Component } from 'react';
import AttributesForm from "../../Form/attributes-form";
import {loader} from "graphql.macro";
import {graphql, compose} from "react-apollo";
import _ from "lodash";
import {attributes} from "../Form";

const OfficialSlotUpdateMutation = loader("../../graphql/mutations/updateOfficialSlot.graphql");
const OfficialSlotQuery = loader("../../graphql/query/officialSlot.graphql");

type Props = {
  officialSlotId: string,
};

type State = {

}

class OfficialSlotUpdateForm extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { officialSlotUpdateMutation } = this.props;

    return <AttributesForm
      useSubmit
      mutation={officialSlotUpdateMutation}
      translateMutationOptions={(input)=>{

        return {
          variables: {
            input
          }
        }
      }}
      attributes={[{
        ..._.find(attributes,{index: 'position'})
      }]}
    />;
  }
}

export default compose(
  graphql(OfficialSlotQuery, {
    name: 'officialSlot',
    options: (props: Props) =>({
      variables: {
        officialSlotId: props.officialSlotId
      }
    }),
  }),
  graphql(OfficialSlotUpdateMutation, {
    name: 'officialSlotUpdateMutation',
    options: (props: Props) =>({
      variables: {
        officialSlotId: props.officialSlotId
      }
    }),
  }),
)(OfficialSlotUpdateForm);
