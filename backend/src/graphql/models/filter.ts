import _ from "lodash";
import { Field, InputType, ObjectType } from "type-graphql";

const myFilter = (item, { value, index }: FilterInput) => {
  if (Array.isArray(value)) {
    return _.indexOf(value, _.get(item, index)) !== -1;
  }

  return _.isEqual(_.get(item, index), value);
};

@InputType()
export class FilterInput {
  public static convertToFilterObject = (
    filters: FilterInput[]
  ): { [key: string]: any } => {
    return filters.reduce((acc: { [key: string]: any }, { value, index }) => {
      let tmp: string | string[] = value;
      if (Array.isArray(tmp) && tmp.length === 1) {
        tmp = _.first(tmp);
      }

      if (Array.isArray(tmp)) {
        if (!acc[index]) {
          acc[index] = {};
        }
        if (!acc[index].or) {
          acc[index].or = [];
        }
        tmp.forEach(singleValue => {
          acc[index].or.push({
            [index]: singleValue
          });
        });
      } else {
        acc[index] = tmp;
      }

      return acc;
    }, {});
  };

  public static performFilter = (array, filters: FilterInput[]) => {
    const filtersClone = filters.slice(0);
    const filter = filtersClone.shift();

    const filteredArray = _.filter(array, item => myFilter(item, filter));
    if (filtersClone.length) {
      return FilterInput.performFilter(filteredArray, filtersClone);
    }

    return filteredArray;
  };

  @Field(type => [String], { nullable: true })
  public value: string[];

  @Field(type => String)
  public index: string;
}
