import * as _ from 'lodash';

const multipleTypes = ['multiSelect', 'multiCheckbox', 'edittable','dropdowncheckbox','dropdownCheckbox'];

const getOptionForType = (options, value, inputType, exportType) => {
  const res = _.first(options.filter(item => item[inputType] === value));
  if (res) {
    return res[exportType];
  }
  return null;
};

export default function(attributes, values, asArray = true) {

  if (!values){
    return null
  }


  const valuesKeys = Object.keys(values);

  let result = _.chain(valuesKeys)
    .map(
      key => {
        let result = null;
        attributes.forEach((attribute) => {
          if (_.get(attribute,'index') === key){
            result = attribute;
          }
          if (_.get(attribute,'inputTypeOptions.addonAfter.index') === key){
            result = _.get(attribute,'inputTypeOptions.addonAfter');
          }
        });
        return result;
      }
    )
    .filter( item => !!item)
    .map(item => {

      let formValue = values[item.index];
      if (formValue === ""){
        formValue = null;
      }
      const value = {

      };
      const multiple = multipleTypes.indexOf(item.inputType) !== -1;

      if (multiple) {
        if (!_.isArray(formValue)) {
          formValue = [formValue];
        }
        switch (item.type) {
          case 'string': {
            value.stringValueList = formValue;
            break;
          }
          case 'int': {
            value.intValueList = formValue;
            break;
          }
          case 'float': {
            value.floatValueList = formValue;
            break;
          }
          case 'bool': {
            value.boolValueList = formValue;
            break;
          }
          case 'object': {
            value.objectValueList = formValue;
            break;
          }
          case 'file': {
            value.stringValueList = formValue;
            break;
          }
          default: {}
        }
      } else {
        switch (item.type) {
          case 'string': {
            if (item.optionValueList && item.optionValueList.length > 0) {
              if (_.isNumber(formValue)) {
                value.stringValue = getOptionForType(
                    item.optionValueList,
                    formValue,
                    'intValue',
                    'stringValue',
                );
              } else if (_.isBoolean(formValue)) {
                value.stringValue = getOptionForType(
                    item.optionValueList,
                    formValue,
                    'boolValue',
                    'stringValue',
                );
              } else {
                value.stringValue = formValue;
              }
            } else {
              value.stringValue = formValue;
            }
            break;
          }
          case 'int': {
            value.intValue = Number.parseInt(formValue, 10);
            break;
          }
          case 'float': {
            value.floatValue = Number.parseFloat(formValue);
            break;
          }

          case 'bool': {
            value.boolValue = !!formValue;
            break;
          }
          case 'object': {

            if (item.inputType === 'attempt'){
              let weight = formValue.weight;
              if (_.isString(weight)){
                if (weight !== ""){
                  weight = weight.replace(',','.');
                  weight = parseFloat(weight);
                }else {
                  weight = null
                }

              }
               value.objectValue = {
                 ...formValue,
                 weight
               }
            }else {
              value.objectValue = formValue;
            }

            break;
          }
          case 'file': {
            value.stringValue = formValue;
            break;
          }
          default: {}
        }
      }


      return {
        index: item.index,
        ...value,
      };
    }).value();

  if (!asArray) {
    result = result.reduce((acc, cur) => {
      const keys = Object.keys(cur);
      const key = _.first(keys.filter(item => item !== 'index'));
      acc[cur.index] = cur[key];
      return acc;
    }, {});
  }

  return result;
}
