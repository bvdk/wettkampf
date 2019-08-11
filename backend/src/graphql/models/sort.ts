import _ from "lodash";
import {Field, InputType, registerEnumType} from "type-graphql";
import {FilterInput} from "./filter";

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

registerEnumType(SortDirection, {
    name: "SortDirection",
});



@InputType()
export class SortInput {


    public static performSort = (array, sortInputs: SortInput[]) => {

        if (!sortInputs || !sortInputs.length) { return  array; }

        const sortArgs = sortInputs.reduce((acc, sortInput: SortInput) => {
            acc[0].push(sortInput.name);
            acc[1].push(sortInput.direction);
            return acc;
        }, [[], []]);

        return _.orderBy(array, sortArgs[0], sortArgs[1]);

    }

    @Field((type) => String, {nullable: true})
    public name: string;

    @Field((type) => SortDirection, {nullable: true})
    public direction: SortDirection;


}
