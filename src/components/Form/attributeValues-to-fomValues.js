import  * as _ from "lodash";
import type {Attribute} from "../../types";

const valueForAttribute = (attribute: Attribute) => {

  return _.get(attribute,'value');

  // const multiple = multiInputTypes.indexOf(attribute.inputType) > -1;
  //
  // switch (attribute.type){
  //   case 'string': {
  //     return multiple ? attribute.stringValues || [] : attribute.stringValue;
  //   }
  //   case 'int': {
  //     return multiple ? attribute.intValues || [] : attribute.intValue;
  //   }
  //   case 'float': {
  //     return multiple ? attribute.floatValues || [] : attribute.floatValue;
  //   }
  //   case 'bool': {
  //     return multiple ? attribute.boolValues || [] : attribute.boolValue;
  //   }
  //   case 'object': {
  //     return multiple ? attribute.objectValues.map(item => JSON.parse(item)) || [] : JSON.parse(attribute.objectValue);
  //   }
  //   default:
  //     return multiple ? attribute.stringValues || [] : attribute.stringValue;
  // }
}

export default function (attributes: Attribute[]) {
  return attributes.reduce((acc, attribute, i)=>{

    acc[attribute.index] = valueForAttribute(attribute)

    return acc;
  },{})
}
/*

const fields = [
  'stringValues',
  'stringValue',
  'floatValues',
  'floatValue',
  'intValues',
  'intValue',
  'boolValues',
  'boolValue',
]

export default function (attributes) {

  return attributes.reduce((acc, attribute, i)=>{
    let value = fields.reduce((acc2, field)=>{
      if (acc2 === undefined){
        acc2 = attribute[field];
      }
      return acc2;

    },undefined);

    if (value !== undefined){
      acc[attribute.index] = value;
    }

    return acc;
  },{})

}
*/
