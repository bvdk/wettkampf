// @flow
import React, {Component} from "react"

import * as _ from "lodash";
import RemoteForm from "./remote-form";
import attributesToFormConfig from "./attributes-to-formConfig";
import attributeValuesToFormValues from "./attributeValues-to-fomValues";
import formValuesToAttributeValues from "./fomValues-to-attributeValues";

type Props = {
  useFormValues: boolean,
  attributes: {
    index: string,
    name: string,
    type: string,
    inputType: string,
    entityType: string,
    rules: [],
    options: {
      searchable: boolean,
      versionable: boolean,
      exportable: boolean,
      componentCreate: boolean,
    },
    optionValues: {
      stringValue: string,
      boolValue: boolean,
      intValue: number,
      floatValue: number
    }[],
    categories: {
      index: string,
      name: string,
    }[],
  }[],
  mutation: ?Function,
  translateMutationOptions: ?Function,
  onSubmit: ?Function, //Should return a promise
  formLayout: ?any,
  formValues: ?any,
  onFieldsChange: ?Function,
  useSubmit: boolean,
  useRawValues: boolean,
  submitTitle: string,
  onSaved: ?Function,
  fullWidthSubmit: boolean,
  layout: string,
    collapse: string[], // Collapse attribute index
}

class AttributesForm extends Component<Props> {

    static defaultProps = {
      useFormValues: false,

    }

    state = {
        collapsed: true
    }

    render(){

      const { translateMutationOptions  } = this.props;
      let { attributes } = this.props;

      const props = {
        ...this.props
      }

      let formValues = props.formValues;
      if (!formValues){
        formValues = !props.useFormValues ? attributeValuesToFormValues(attributes) : {};
      }

        if (this.props.collapse && this.state.collapsed){
            attributes = attributes.filter(item => this.props.collapse.indexOf(item.index) !== -1);
        }

      const formConfig = attributesToFormConfig(attributes);
      return <RemoteForm {...props} formValues={formValues} formConfig={formConfig} translateMutationOptions={(values)=>{

        let result = values;

        if (!props.useFormValues){
          let tmpValues = Object.keys(values)
            .filter((key)=>{
              return !_.isEqual(values[key],formValues[key])
            })
            .reduce((acc, key)=>{
              acc[key] = values[key];
              return acc;
            },{})

          result = formValuesToAttributeValues([...attributes, ...attributes.filter(item => item.config && item.config.addonAfter && item.config.addonAfter.index ).map(item => item.config.addonAfter)], tmpValues);

        }

        if (translateMutationOptions){
          return translateMutationOptions(result);
        }else {
          return result;
        }

      }}/>;
    }

}

export default AttributesForm;
