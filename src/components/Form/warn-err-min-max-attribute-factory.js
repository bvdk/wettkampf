import * as _ from "lodash";

export default class WarnErrMinMaxAttributeFactory {

  /**
   *
   * @param attributes
   * @returns object
   * {
      title: '',
      type: 'limit',
      config: {
        warning: {
          min: {
            name: '',
            type: 'number'
          },
          max: {
            type: 'number',
            name: '',
          }
        },
        error: {
          min: {
            name: '',
            type: 'number'
          },
          max: {
            name: '',
            type: 'number'
          }
        }
      }
    }
   */
  static generateFormAttributes(attributes, titleFunction){

    return attributes.reduce((acc, cur)=>{
      acc[cur.attribute.name] = {
        ...cur.attribute,
        title: titleFunction ? titleFunction(cur.attribute) : cur.attribute.title,
        type: 'limit',
        config: {
          warning: {
            min: {
              ...WarnErrMinMaxAttributeFactory.attributeToFormAttribute(cur.warning.min.attribute),
              title: 'Min',
            },
            max: {
              ...WarnErrMinMaxAttributeFactory.attributeToFormAttribute(cur.warning.max.attribute),
              title: 'Max'
            }
          },
          error: {
            min: {
              ...WarnErrMinMaxAttributeFactory.attributeToFormAttribute(cur.error.min.attribute),
              title: 'Min'
            },
            max: {
              ...WarnErrMinMaxAttributeFactory.attributeToFormAttribute(cur.error.max.attribute),
              title: 'Max'
            }
          }
        }
      }
      return acc;
    },{})

  }

  static getValues(attributes){

    const res = attributes.reduce((acc, cur)=>{
      acc[cur.warning.min.attribute.name] = cur.warning.min.value;
      acc[cur.warning.max.attribute.name] = cur.warning.max.value;
      acc[cur.error.min.attribute.name] = cur.error.min.value;
      acc[cur.error.max.attribute.name] = cur.error.max.value;
      return acc;
    },{});

    Object.keys(res).forEach((key)=>{
        if (res[key] && res[key] < 0.01){
          res[key] = Number(res[key]).toExponential(2)
        }
    });
    return res;

  }

  static attributeToFormAttribute(attribute){
    const message = 'Angegebener Wert muss eine gültige Zahl sein (Punkte als Dezimaltrennzeichen)';
    return {
      ...attribute,
      rules: [
        {
          validator: (rule, value, callback)=>{

            if (value){
              const tmp = Number(value);
              if (_.isNaN(tmp)){
                callback(message);
              }else {
                callback();
              }
            }
            callback();
          },
          message
        }
      ],
      type: 'text',//attribute.type.toLowerCase()
    }
  }

}
