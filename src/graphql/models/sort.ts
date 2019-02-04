import {Field, InputType, registerEnumType} from "type-graphql";
import {Discipline} from "./discipline";

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

registerEnumType(SortDirection, {
    name: "SortDirection",
});


@InputType()
export class SortInput {


    @Field((type) => String, {nullable: true})
    public name: string;

    @Field((type) => SortDirection, {nullable: true})
    public direction: SortDirection;


}
