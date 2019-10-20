// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import AttributesForm from '../../Form/attributes-inline-form';

type Props = {
  formValues?: any,
  onSubmit?: Function,
  mutation: Function,
  translateMutationOptions: Function
};

const attributes = [
  {
    index: 'gender',
    name: 'Geschlecht',
    type: 'string',
    rules: [
      {
        name: 'required'
      }
    ],
    inputType: 'select',
    entityType: 'enum',
    enumType: 'Gender'
  },
  {
    index: 'firstName',
    name: 'Vorname',
    type: 'string',
    rules: [
      {
        name: 'required'
      }
    ],
    inputType: 'text'
  },
  {
    index: 'lastName',
    name: 'Nachname',
    type: 'string',
    rules: [
      {
        name: 'required'
      }
    ],
    inputType: 'text'
  },
  {
    index: 'club',
    name: 'Verein',
    type: 'string',
    inputType: 'text'
  },
  {
    index: 'birthday',
    name: 'Geburtstag',
    type: 'string',
    inputType: 'date'
  },
  {
    index: 'ageClassId',
    name: 'Altersklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'AgeClass'
  },
  {
    index: 'weightClassId',
    name: 'Gewichtsklasse',
    type: 'string',
    inputType: 'select',
    entityType: 'WeightClass'
  },
  {
    index: 'raw',
    name: 'Raw',
    type: 'bool',
    inputType: 'checkbox'
  },
  {
    index: 'bodyWeight',
    name: 'Körpergewicht',
    type: 'float',
    inputType: 'float',
    inputTypeOptions: {
      addonAfter: 'Kg'
    }
  },
  {
    index: 'los',
    name: 'Los',
    type: 'int',
    inputType: 'int'
  }
];

const lockedIfImported = [
  'gender',
  'firstName',
  'lastName',
  'club',
  'ageClassId',
  'birthday'
];

export default class AthleteForm extends Component<Props> {
  props: Props;

  static defaultProps = {
    useSubmit: false,
    onChange: null,
    onSubmit: null
  };

  render() {
    const { formValues } = this.props;
    const filteredAttributes = attributes.map(attribute => {
      if (_.get(formValues, 'importId')) {
        const value = _.get(formValues, attribute.index);
        if (value && lockedIfImported.indexOf(attribute.index) > -1) {
          return {
            ...attribute,
            readonly: true
          };
        }
      }
      return attribute;
    });

    return (
      <AttributesForm
        useSubmit
        onSubmit={this.props.onSubmit}
        values={this.props.formValues}
        mutation={this.props.mutation}
        translateMutationOptions={this.props.translateMutationOptions}
        attributes={filteredAttributes}
      />
    );
  }
}
