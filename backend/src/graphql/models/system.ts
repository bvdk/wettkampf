import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Gender} from "./gender";

@ObjectType()
export class System {

    @Field((type) => ID)
    public id: string;

    @Field((type) => String)
    public version: string;

    @Field((type) => String)
    public name: string;

}
