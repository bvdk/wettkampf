import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {AgeClass} from "./ageClass";
import { Athlete } from "./athlete";
import {Gender} from "./gender";
import {Slot} from "./slot";
import {WeightClass} from "./weightClass";

@ObjectType()
export class AthleteGroup {

    public static collectionKey: string = "athleteGroups";

    @Field((type) => ID)
    public id: string;

    @Field((type) => ID)
    public eventId: string;

    @Field((type) => ID, {nullable: true})
    public slotId?: string;

    @Field((type) => Slot, {nullable: true})
    public slot?: Slot;

    @Field()
    public name: string;

    @Field((type) => Gender, { nullable: true })
    public gender?: Gender;

    @Field((type) => ID, { nullable: true })
    public ageClassId?: string;

    @Field((type) => AgeClass, { nullable: true })
    public ageClass?: AgeClass;

    @Field((type) => ID, { nullable: true })
    public weightClassId?: string;

    @Field((type) => WeightClass, { nullable: true })
    public weightClass?: WeightClass;

    @Field( (type) => Athlete )
    public athletes: Athlete[];

    @Field( (type) => Int )
    public athleteCount: number;

    @Field( (type) => Boolean )
    public shallow?: boolean;

}


@InputType()
export class AthleteGroupInput implements Partial<AthleteGroup> {

    @Field( { nullable: true })
    public name?: string;

    @Field((type) => Gender, { nullable: true })
    public gender?: Gender;

    @Field((type) => ID, { nullable: true })
    public ageClassId?: string;

    @Field((type) => ID, { nullable: true })
    public weightClassId?: string;

}
