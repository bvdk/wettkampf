// @flow
import React, { Component } from 'react';
import AttributesForm from "../../Form/attributes-inline-form";

type Props = {
  formValues?: any,
  onSubmit?: Function,
  mutation: Function,
  translateMutationOptions: Function,
};

const attributes = [
  {
    index: 'name',
    name: 'Name',
    type: 'string',
    inputType: 'text',
    rules: [{name: 'required'}],
  }
];


export default class SlotForm extends Component<Props> {

  props: Props;

  static defaultProps = {
    useSubmit: false,
    onChange: null,
    onSubmit: null,
    formValues: {

    }
  };

  render() {

    return (
      <AttributesForm
        useSubmit
        onSubmit={this.props.onSubmit}
        values={this.props.formValues}
        mutation={this.props.mutation}
        translateMutationOptions={this.props.translateMutationOptions}
        attributes={attributes}
      />
    );
  }
}
