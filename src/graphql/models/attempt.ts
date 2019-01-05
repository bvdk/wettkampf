import {Field, Float, ID, Int, ObjectType} from "type-graphql";
import {Discipline} from "./discipline";
import {Gender} from "./gender";

@ObjectType()
export class Attempt {

    public static collectionKey: string = "attempts";

    @Field((type) => ID)
    public id: string;

    @Field((type) => Float)
    public weight?: number;

    @Field()
    public valid?: boolean;

    @Field()
    public done?: boolean;

    @Field((type)=> String)
    public date?: Date;
}
