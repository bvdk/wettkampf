// @flow
import React, { Component } from 'react';
import AttributesForm from "../Form/attributes-inline-form";

type Props = {
  formValues?: any,
  onSubmit?: Function,
  mutation: Function,
  translateMutationOptions: Function,
};

const attributes = [
  {
    index: 'gender',
    name: 'Geschlecht',
    type: 'string',
    rules: [{
      name: 'required'
    }],
    inputType: 'select',
    entityType: 'enum',
    enumType: 'Gender',
  },
  {
    index: 'firstName',
    name: 'Vorname',
    type: 'string',
    rules: [{
      name: 'required'
    }],
    inputType: 'text',
  },
  {
    index: 'lastName',
    name: 'Nachname',
    type: 'string',
    rules: [{
      name: 'required'
    }],
    inputType: 'text',
  },{
    index: 'birthday',
    name: 'Geburtstag',
    type: 'string',
    inputType: 'date',
  },{
    index: 'club',
    name: 'Verein',
    type: 'string',
    inputType: 'text',
  },{
    index: 'ageClass',
    name: 'Altersklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'AgeClass',
  },{
    index: 'weightClass',
    name: 'Gewichtsklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'WeightClass',
  }
];

export default class AthleteForm extends Component<Props> {

  props: Props;

  static defaultProps = {
    useSubmit: false,
    onChange: null,
    onSubmit: null,
    athlete: {

    }
  };

  render() {


    return (
      <AttributesForm
        useSubmit
        onSubmit={this.props.onSubmit}
        formValues={this.props.formValues}
        mutation={this.props.mutation}
        translateMutationOptions={this.props.translateMutationOptions}
        attributes={attributes}
      />
    );
  }
}
