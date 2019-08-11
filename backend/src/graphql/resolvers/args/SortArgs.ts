import {ArgsType, Field} from "type-graphql";
import {SortInput} from "../../models/sort";

@ArgsType()
export default class SortArgs {
    @Field((type) => [SortInput], {nullable: true})
    public sort: SortInput[];
}
