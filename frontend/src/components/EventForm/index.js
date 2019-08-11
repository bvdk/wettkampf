// @flow
import React, { Component } from 'react';
import AttributesForm from "../Form/attributes-inline-form";

type Props = {
  mutation: Function,
  translateMutationOptions?: Function,
  data?: any,
  useSubmit?: ?boolean,
  onChange?: ?Function,
  onSubmit?: ?Function
};

const attributes = [
  {
    index: 'name',
    name: 'Bezeichnung',
    type: 'string',
    rules: [{name: 'required'}],
    inputType: 'text',
  },{
    index: 'discipline',
    name: 'Disziplin',
    type: 'string',
    rules: [{name: 'required'}],
    entityType: 'enum',
    enumType: 'Discipline',
    inputType: 'select',

  },{
    index: 'contestType',
    name: 'Wettbewerb',
    type: 'string',
    rules: [{name: 'required'}],
    entityType: 'enum',
    enumType: 'ContestType',
    inputType: 'select',

  },{
    index: 'teamSize',
    name: 'Anzahl der Athleten pro Team',
    type: 'int',
    inputType: 'int',
    condition: (form) => form.getFieldValue('contestType') === 'TEAM'
  },{
    index: 'teamGender',
    name: 'Wertung',
    type: 'string',
    entityType: 'enum',
    enumType: 'Gender',
    inputType: 'select',
    condition: (form) => form.getFieldValue('contestType') === 'TEAM'
  }
];

export default class EventForm extends Component<Props> {
  props: Props;
  static defaultProps = {
    useSubmit: false,
    onChange: null,
    onSubmit: null,
    data: {}
  };

  render() {
    return (
      <AttributesForm
        mutation={this.props.mutation}
        translateMutationOptions={this.props.translateMutationOptions}
        values={this.props.data}
        useSubmit={true}
        attributes={attributes}
        onSubmit={this.props.onSubmit}
      />
    );
  }
}
