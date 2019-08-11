export default function (attributeType, value){
  switch (attributeType){

    case 'string': {
      return String(value);
    }

    case 'bool': {
      return !!Number.parseInt(value, 10);
    }

    case 'int': {
      return Number.parseInt(value, 10);
    }

    case 'float': {
      return Number.parseFloat(value)
    }

    default: {

    }
  }

  return value
}
