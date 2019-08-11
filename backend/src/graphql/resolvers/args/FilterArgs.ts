import {ArgsType, Field, ID} from "type-graphql";
import {FilterInput} from "../../models/filter";

@ArgsType()
export default class FilterArgs {
    @Field((type) => [FilterInput], {nullable: true})
    public filters: FilterInput[];
}
