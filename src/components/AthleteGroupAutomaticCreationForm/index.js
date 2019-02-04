// @flow
import React, { Component } from 'react';
import AttributesInlineForm from "../Form/attributes-inline-form";

type Props = {
  eventId: string,
  onChange: Function
};

export default class AthleteGroupAutomaticCreationForm extends Component<Props> {
  props: Props;

  render() {

    const attributes = [
      {
        index: 'keys',
        name: 'Kriterien',
        type: 'string',
        rules: [{name: 'required'}],
        inputType: 'checkbox',
        optionValues: [{
          name: 'Geschlecht',
          value: 'GENDER'
        },{
          name: 'Alterklasse',
          value: 'AGE_CLASS',
        },{
          name: 'Gewichtsklasse',
          value: 'WEIGHT_CLASS',
        }]
      },{
        index: 'maxGroupSize',
        name: 'Gruppengröße',
        inputType: 'int',
        type: 'int',
      },{
        index: 'useExisting',
        name: 'Bestehende verwenden',
        inputType: 'switch',
        type: 'bool',
      }
    ];

    const {onChange, values} = this.props;

    return <AttributesInlineForm
        values={values}
        layout={'inline'}
        attributes={attributes}
        useSubmit={false}
        onChange={onChange}/>
  }
}
