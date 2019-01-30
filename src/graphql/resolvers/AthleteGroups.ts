import {Context} from "graphql-yoga/dist/types";
import * as _ from "lodash";
import {Arg, Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Athlete} from "../models/athlete";
import {AthleteGroup, AthleteGroupInput} from "../models/athleteGroup";
import {AthleteGroupCreationKey, AthleteGroupCreationResult} from "../models/athleteGroupCreationResult";
import {Gender} from "../models/gender";
import IdArgs from "./args/IdArgs";
import AthletesResolver from "./Athletes";
import EventResolver from "./Event";
import EventsResolver from "./Events";
import createAutoCreateAthleteGroups from "../../utils/autoCreateAthleteGroups";

@ArgsType()
class CreateAthleteGroupArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => ID, {nullable: true})
    public slotId: string;

    @Field((type) => AthleteGroupInput)
    public data?: AthleteGroupInput;
}

@ArgsType()
class SetAthleteGroupSlotArgs {
    @Field((type) => ID)
    public athleteGroupId: string;

    @Field((type) => ID)
    public slotId: string;
}

@ArgsType()
class AthleteGroupCreationArgs {

    @Field((type) => Boolean, { description: "Wenn true wird das Ergebnis nicht in die Datenbank geschrieben"})
    public preview: boolean;

    @Field((type) => [ID], {
        description: "Wenn nicht gewählt werden alle Athleten ohne Startgruppe verwendet.",
        nullable: true,
    })
    public athleteIds?: [string];

    @Field((type) => ID)
    public eventId?: string;

    @Field((type) => [AthleteGroupCreationKey])
    public keys?: AthleteGroupCreationKey[];

    @Field((type) => Int, {
        description: "Maximale Startgruppengröße, wenn 0 werden alle passenden Athleten in eine Gruppe gespeichert.",
        nullable: true,
    })
    public maxGroupSize?: number;

    @Field((type) => Boolean, { description: "Wenn true werden bestehende Startgruppen mit einbezogen", nullable: true})
    public useExisting?: boolean;

    @Field((type) => Boolean, { description: "Gruppen auf bestehende Bühnen verteilen", nullable: true})
    public distributeSlots?: boolean;

}


@ArgsType()
class AddAthletesToAthleteGroupArgs {
    @Field((type) => ID)
    public athleteGroupId: string;

    @Field((type) => [ID])
    public athleteIds: string[];
}


@Resolver()
export default class AthleteGroupsResolver {

    private collectionKey: string = AthleteGroup.collectionKey;


    @Query((returns) => AthleteGroup)
    public athleteGroup(
        @Args() {id}: IdArgs,
    ): AthleteGroup {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Mutation()
    public createAthleteGroup(
        @Args() {data, slotId, eventId}: CreateAthleteGroupArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        if (!slotId) {
            const eventsResolver = new EventsResolver();
            const event = eventsResolver.event({id: eventId});
            const eventResolver = new EventResolver();
            const slots = eventResolver.slots(event);
            slotId = _.chain(slots).first().get("id").value();
        }

        return CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
            slotId,
        });
    }

    @Mutation()
    public updateAthleteGroup(

        @Args() {id}: IdArgs,
        @Arg("data") data: AthleteGroupInput,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public setAthleteGroupSlot(

        @Args() {athleteGroupId, slotId}: SetAthleteGroupSlotArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.updateItem(this.collectionKey, athleteGroupId, {
            slotId,
        });
    }

    @Mutation((type) => AthleteGroup)
    public addAthletesToAthleteGroup(
        @Args() {athleteGroupId, athleteIds}: AddAthletesToAthleteGroupArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        const athletes = athleteIds.map((athleteId: string) => CrudAdapter.updateItem(Athlete.collectionKey, athleteId, {
            athleteGroupId,
        }));
        return this.athleteGroup({id: athleteGroupId});
    }

    @Mutation()
    public deleteAthleteGroup(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

    @Mutation()
    public autoCreateAthleteGroups(
        @Args() {
            athleteIds,
            distributeSlots,
            useExisting,
            eventId,
            keys,
            maxGroupSize,
            preview,
        }: AthleteGroupCreationArgs,
        @Ctx() ctx: Context,
    ): AthleteGroupCreationResult {

        const eventResolver = new EventResolver();
        let athletes = eventResolver.getEventAthletes(eventId);
        if (athleteIds && athleteIds.length) {
            athletes = athletes.filter((item: Athlete) => athleteIds.indexOf(item.id) > -1);
        }

        let athleteGroups = [];
        if (useExisting) {
            athleteGroups = eventResolver.getEventAthleteGroups(eventId);
        }

        return createAutoCreateAthleteGroups({
            athleteGroups,
            athletes,
            distributeSlots,
            eventId,
            keys,
            maxGroupSize,
            preview,
            useExisting,
        });
    }
}
