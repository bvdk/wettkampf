import {Context} from "graphql-yoga/dist/types";
import _ from "lodash";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Athlete} from "../models/athlete";
import {Attempt, AttemptInput, AttemptUpdateInput} from "../models/attempt";
import {Discipline} from "../models/discipline";
import IdArgs from "./args/IdArgs";
import AthleteResolver from "./Athlete";
import AthletesResolver from "./Athletes";
import EventResolver from "./Event";
import EventsResolver from "./Events";

@ArgsType()
class CreateAttemptArgs {
    @Field((type) => ID)
    public athleteId: string;

    @Field((type) => AttemptInput)
    public data: AttemptInput;

    @Field((type) => Discipline)
    public discipline: Discipline;
}


@Resolver()
export default class AttemptsResolver {

    private collectionKey: string = Attempt.collectionKey;

    @Query((returns) => Attempt)
    public attempt(
        @Args() {id}: IdArgs,
    ): Attempt {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Mutation()
    public createAttempt(
        @Args() {data, athleteId, discipline}: CreateAttemptArgs,
        @Ctx() ctx: Context,
    ): Attempt {

        const athleteResolver = new AthleteResolver();
        const existingAttempts = athleteResolver.getAttempts(athleteId, discipline);

        const attempt: Attempt = CrudAdapter.insertItem(this.collectionKey, {
            discipline,
            date: new Date(),
            ...data,
            index: existingAttempts.length,
            athleteId,
        });

        this.autoUpdateTotalAndPoints(attempt.athleteId);

        return attempt;
    }

    @Mutation()
    public updateAttempt(

        @Args() {id}: IdArgs,
        @Arg("data") data: AttemptUpdateInput,
        @Arg("skipAutoCalc",{nullable: true}) skipAutoCalc: boolean,
        @Ctx() ctx: Context,
    ): Attempt {

        const attempt: Attempt = CrudAdapter.updateItem(this.collectionKey, id, data);
        if (!skipAutoCalc) {
            this.autoUpdateTotalAndPoints(attempt.athleteId);
        }
        return attempt;

    }

    @Mutation()
    public autoCalcAthletePoints(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): boolean {
        this.autoUpdateTotalAndPoints(id);
        return true;
    }


    public autoUpdateTotalAndPoints(athleteId: string): Athlete | void {

        const athletesResolver = new AthletesResolver();
        const athleteResolver = new AthleteResolver();
        const athlete = athletesResolver.athlete({id: athleteId});
        if (!athlete) { return null; }
        const bestAttempts = athleteResolver.bestAttempts(athlete);
        const total: number = bestAttempts.map((item) => item.weight).reduce((pv, cv) => pv + cv, 0);

        if (!_.isNaN(total) && total > 0) {
            return athletesResolver.updateAthlete({id: athleteId}, {
                points: athlete.wilks ? athlete.wilks * total : null,
                total,
            }, null);
        }
        return null;
    }

    @Mutation()
    public deleteAttempt(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): Attempt {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

    @Mutation()
    public removeAllAttempts(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): boolean {

        const eventsResolver = new EventsResolver();
        const eventResolver = new EventResolver();
        const athleteResolver = new AthleteResolver();

        const event = eventsResolver.event({id});
        const athletes = eventResolver.athletes(event);

        athletes.forEach((athlete) => {
            const existingAttempts = athleteResolver.getAttempts(athlete.id);
            existingAttempts.forEach((item) => {
                this.deleteAttempt({id: item.id}, ctx);
            });

        });

        return true;
    }

    @Mutation()
    public simulateAttempts(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): boolean {

        const eventsResolver = new EventsResolver();
        const eventResolver = new EventResolver();
        const athleteResolver = new AthleteResolver();

        const event = eventsResolver.event({id});
        const athletes = eventResolver.athletes(event);

        athletes.forEach((athlete) => {
            const disciplines = [];

            if (event.discipline === Discipline.POWERLIFTING) {
                disciplines.push(Discipline.BENCHPRESS);
                disciplines.push(Discipline.SQUAT);
                disciplines.push(Discipline.DEADLIFT);
            } else {
                disciplines.push(event.discipline);
            }

            disciplines.forEach((discipline) => {
                const existingAttempts = athleteResolver.getAttempts(athlete.id, discipline);
                if (!existingAttempts.length) {
                    for (let i = 0; i < 3; i++) {
                        this.createAttempt({
                            athleteId: athlete.id,
                            data: {
                                done: true,
                                valid: Math.random() < 0.5,
                                weight: Math.floor(Math.random() * 200) + 100,
                            },
                            discipline,
                        }, ctx);
                    }
                }
            });


        });

        return true;

    }

}
