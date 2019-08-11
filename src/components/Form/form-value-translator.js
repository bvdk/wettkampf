import * as moment from "moment";
import { Form } from 'antd';
import _ from 'lodash'
import attributeValuesToFomValues from "./attributeValues-to-fomValues";

class FormValueTranslator {


    static translateAttributes(attributes, values?: any){

        const rawValues = values || attributeValuesToFomValues(attributes);

        return attributes.reduce((res, attribute)=>{
            const rawValue = rawValues[attribute.index];
            if (attributes && rawValue !== undefined) {
                res[attribute.index] = Form.createFormField(FormValueTranslator.valueForField({type: attribute.inputType }, rawValue));
            }
            if (attribute && attribute.inputTypeOptions && attribute.inputTypeOptions.addonAfter && attribute.inputTypeOptions.addonAfter.index){
                const addonIndex = attribute.inputTypeOptions.addonAfter.index;
                res[addonIndex] = Form.createFormField(FormValueTranslator.valueForField({type: attribute.inputTypeOptions.addonAfter.inputType }, rawValues[addonIndex]))
            }
            return res;
        },{});
    }

    static translate(formConfig, rawValues){
        return Object.keys(formConfig.fields).reduce((res, cur)=>{
            const field = formConfig.fields[cur];
            const rawValue = rawValues[cur];
            if (field && rawValue !== undefined) {
                res[cur] = Form.createFormField(FormValueTranslator.valueForField(field, rawValue));
            }
            if (field && field.config && field.config.addonAfter && field.config.addonAfter.index){
                const addonIndex = field.config.addonAfter.index;
                res[addonIndex] = Form.createFormField(FormValueTranslator.valueForField(field.config.addonAfter, rawValues[addonIndex]))
            }

            return res;
        },{});
    }

    static valueForField(field, rawValue){
        // (props.formConfig.fields[cur].type === 'daterange' || props.formConfig.fields[cur].type === 'datetimerange')
        switch (field.type){
            case 'date':
            case 'datetime': {
                return {
                    value: rawValue ? moment(rawValue) : null
                }
            }

            case 'daterange':
            case 'datetimerange':{
                return {
                    value: rawValue.map(value => moment(value))
                }
            }

            case 'multiSelect': {
                if (!_.isArray(rawValue)){
                    return {
                        value: [rawValue]
                    }
                }
                break;
            }

            case 'dropdowncheckbox': {
                if (!_.isArray(rawValue)){
                    return {
                        value: [rawValue]
                    }
                }
                break;
            }

            default: {}
        }


        return {
            value: rawValue
        }
    }

}

export default FormValueTranslator;
