import _ from "lodash";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Gender } from "../models/gender";
import { WeightClass } from "../models/weightClass";

@Resolver(of => WeightClass)
export default class WeightClassResolver
  implements ResolverInterface<WeightClass> {
  @FieldResolver()
  public name(@Root() weightClass: WeightClass) {
    return `${
      weightClass.gender === Gender.MALE
        ? "Männer"
        : weightClass.gender === Gender.FEMALE
        ? "Frauen"
        : ""
    } ${_.get(weightClass, "name", "")}`;
  }
}
