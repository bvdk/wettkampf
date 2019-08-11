import rules from "./rules";
import FormFactory from "./form-factory";

import * as _ from "lodash";
import EnumLoaderConfig from "../DataLoader/EnumLoaderConfig";

const RULES_MAP = {
  'image': rules.image,
  'email': rules.email,
  'required': rules.required
}

const getRules = (inputRules) => {

  if (!inputRules){
    return [];
  }

    return inputRules.filter(item => !!RULES_MAP[_.get(item, 'name')]).map((rule) => {
    return RULES_MAP[rule];
  })
}

const attributeToFormConfig = (cur) => {

  let { placeholder } = cur;

  let type = FormFactory.types.indexOf(cur.inputType) > -1 ? cur.inputType : 'text';

  switch (type){
    case 'checkbox': {
      type = 'switch';
      break;
    }
    case 'text': {
      if (cur.type === 'int'){
        type = 'int';
      }break;
    }
    default: {}
  }

  let config = {};

  switch (cur.entityType){

      case 'enum': {
          config.loaderConfig = {
              ...EnumLoaderConfig,
              getQueryVariables: ()=> ({
                  name: cur.enumType
              })
          };
          break;
      }

    default:
      break;
  }

  if (cur.config ){

    config = {
      ...config,
      ...cur.config
    }
  }

  if (config.loaderOptions && config.loaderConfig){
    config.loaderConfig = {
      ...config.loaderConfig,
      ...config.loaderOptions
    }
  }

  if (_.isObject(config.addonAfter) && config.addonAfter.index){
    config.addonAfter = {
      ...attributeToFormConfig(config.addonAfter),
      index: config.addonAfter.index
    };
  }

    if (cur.file) {
        config.file = cur.file;
    }


    const rules = getRules(cur.rules);

  return {
    title: cur.name,
      rules,
    type,
    config,
    placeholder,
    options: cur.optionValues
      ? cur.optionValues.map(value => ({
        title: value.name,
        value: value.stringValue,
      }))
      : null,
  };

}

export default function attributesToFormConfig(attributes, formName) {

  const fields = attributes.reduce((acc, cur)=>{
    acc[cur.index] = attributeToFormConfig(cur);
    return acc;
  },{})

  return {
    formName,
    fields
  }
}
