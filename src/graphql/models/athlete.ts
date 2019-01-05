import {Field, Float, ID, InputType, Int, ObjectType} from "type-graphql";
import {AgeClass} from "./ageClass";
import {Attempt} from "./attempt";
import {Discipline} from "./discipline";
import {Event} from "./event";
import {Gender} from "./gender";
import {Slot} from "./slot";
import {WeightClass} from "./weightClass";

@ObjectType()
export default class Athlete {

    public static collectionKey: string = "athletes";

    @Field((type) => ID)
    public id: string;

    @Field()
    public eventId?: string;

    @Field((type) => Event)
    public event?: Event;

    @Field()
    public slotId?: string;

    @Field((type) => Slot)
    public slot?: Slot;

    @Field()
    public importId?: string;

    @Field()
    public firstName: string;

    @Field()
    public lastName: string;

    @Field()
    public gender: Gender;

    @Field()
    public birthday: Date;

    @Field()
    public club?: string;

    @Field()
    public norm?: boolean;

    @Field()
    public lateRegistration?: boolean;

    @Field()
    public price?: string;

    @Field((type) => AgeClass)
    public ageClass?: AgeClass;

    @Field((type) => Float, { description: "Body weight in kg"})
    public bodyWeight?: number;

    @Field((type) => WeightClass)
    public weightClass?: WeightClass;

    @Field((type) => Int, { description: "Attempt count"})
    public attemptCount?: number;

    @Field((type) => Float, { description: "Calc wilks"})
    public wilks?: number;

    @Field((type) => Int)
    public los?: number;

    @Field((type) => Float)
    public points?: number;

    @Field((type) => Float)
    public total?: number;

    @Field((type) => Int)
    public place?: number;

    @Field((type) => Int)
    public location?: number;

    @Field((type) => [Attempt])
    public attempts?: Attempt[];
}


@InputType()
export class AthleteInput implements Partial<Athlete> {

    @Field()
    public importId?: string;

    @Field()
    public firstName: string;

    @Field()
    public lastName: string;

    @Field()
    public gender: Gender;

    @Field()
    public birthday: Date;

    @Field()
    public club?: string;

    @Field()
    public norm?: boolean;

    @Field()
    public lateRegistration?: boolean;

    @Field()
    public price?: string;

    @Field()
    public ageClassId?: string;

    @Field((type) => Float, { description: "Body weight in kg"})
    public bodyWeight?: number;

    @Field()
    public weightClassId?: string;

    @Field((type) => Int, { description: "Attempt count"})
    public attemptCount?: number;

    @Field((type) => Float, { description: "Calc wilks"})
    public wilks?: number;

    @Field((type) => Int)
    public los?: number;

    @Field((type) => Float)
    public points?: number;

    @Field((type) => Float)
    public total?: number;

    @Field((type) => Int)
    public place?: number;

    @Field((type) => Int)
    public location?: number;

}
