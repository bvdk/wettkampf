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
    index: 'name',
    name: 'Bezeichnung',
    type: 'string',
    inputType: 'text',
    inputTypeOptions: {
      placeholder: 'Automatisch bestimmen'
    }
  },{
    index: 'gender',
    name: 'Geschlecht',
    type: 'string',
    inputType: 'select',
    entityType: 'enum',
    enumType: 'Gender',
  },{
    index: 'ageClassId',
    name: 'Altersklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'AgeClass',
  },{
    index: 'weightClassId',
    name: 'Gewichtsklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'WeightClass',
    condition: (form) => {
      return !form.getFieldValue('gender');
    }
  },{
    index: 'weightClassId',
    name: 'Gewichtsklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'WeightClassMale',
    condition: (form) => {
      return form.getFieldValue('gender') === 'MALE';
    }
  },{
    index: 'weightClassId',
    name: 'Gewichtsklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'WeightClassFemale',
    condition: (form) => {
      return form.getFieldValue('gender') === 'FEMALE';
    }
  }
];

export default class AthleteGroupForm extends Component<Props> {

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
