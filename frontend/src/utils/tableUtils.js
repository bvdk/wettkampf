import _ from "lodash";

export const defaultSorter = (a, b, key, defaultValue) => {
  const aValue = _.get(a,key) || defaultValue;
  const bValue = _.get(b,key) || defaultValue;

  if(aValue < bValue) { return -1; }
  if(aValue > bValue) { return 1; }
  return 0;
}

export const defaultFilter = (groupKeyPath, dataKeyPath, valueKeyPath, textKeyPath, athletes) => {
  const tmp = _.chain(athletes)
    .groupBy(groupKeyPath)
    .map((athletes)=>{
      const athlete = _.first(athletes);
      const item = _.get(athlete,dataKeyPath);
      if (item){
        return {
          text: _.get(item,textKeyPath),
          value: _.get(item,valueKeyPath),
        }
      }
      return {
        text: 'Ohne',
        value: 'null'
      }
    })
    .filter((item)=> item)
    .orderBy(["text","asc"])
    .value()

  return tmp;
}

export const defaultOnFilter = (keyPath) => {

  return (value, record) => {
    let arrVal = value;
    if (!Array.isArray(arrVal)){
      arrVal = [value];
    }
    return arrVal.indexOf(_.get(record,keyPath, 'null')) !== -1;
  }
}
