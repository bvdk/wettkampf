// @flow
import React, { Component } from 'react';
import AttributesForm from "../../Form/attributes-inline-form";

type Props = {
  formValues?: any,
  onSubmit?: Function,
  mutation: Function,
  translateMutationOptions: Function,
};

export const attributes = [
  {
    index: 'firstName',
    name: 'Vorname',
    type: 'string',
    inputType: 'text',
    rules: [{name: 'required'}],
  },{
    index: 'lastName',
    name: 'Nachname',
    type: 'string',
    inputType: 'text',
    rules: [{name: 'required'}],
  },{
    index: 'location',
    name: 'Ort',
    type: 'string',
    inputType: 'text'
  },{
    index: 'license',
    name: 'Lizenz',
    type: 'string',
    inputType: 'text',
  },{
    index: 'position',
    name: 'Position',
    type: 'string',
    inputType: 'select',
    optionValues: [{
      value: 'Hauptkampfrichter',
      name: 'Hauptkampfrichter'
    },{
      value: 'Seitenkampfrichter',
      name: 'Seitenkampfrichter'
    },{
      value: 'Jury',
      name: 'Jury'
    },{
      value: 'Sprecher',
      name: 'Sprecher'
    },{
      value: 'Protokollführer',
      name: 'Protokollführer'
    }]
  }
];


export default class OfficialForm extends Component<Props> {

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
