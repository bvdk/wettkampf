import { Context } from "graphql-yoga/dist/types";
import _ from "lodash";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import { AthleteGroup } from "../models/athleteGroup";
import { Attempt, AttemptInput, AttemptUpdateInput } from "../models/attempt";
import { Discipline } from "../models/discipline";
import { IdArgs } from "./args/IdArgs";
import AthleteResolver from "./Athlete";
import AthletesResolver from "./Athletes";
import EventResolver from "./Event";
import EventsResolver from "./Events";

@ArgsType()
class CreateAttemptArgs {
  @Field(type => ID)
  public athleteId: string;

  @Field(type => AttemptInput)
  public data: AttemptInput;

  @Field(type => Discipline)
  public discipline: Discipline;
}

@Resolver()
export default class AttemptsResolver {
  private collectionKey: string = Attempt.collectionKey;

  @Query(returns => Attempt)
  public attempt(@Args() { id }: IdArgs): Attempt {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createAttempt(
    @Args() { data, athleteId, discipline }: CreateAttemptArgs,
    @Ctx() ctx: Context,
    @PubSub("UPDATE_NEXT_ATHLETE_NOTIFICATIONS")
    publish: Publisher<{ slotId: string }>
  ): Attempt {
    const athletesResolver = new AthletesResolver();
    const athlete = athletesResolver.athlete({ id: athleteId });
    const athleteGroup = CrudAdapter.getItem(
      AthleteGroup.collectionKey,
      athlete.athleteGroupId
    );
    const athleteResolver = new AthleteResolver();
    const existingAttempts = athleteResolver.getAttempts(athleteId, discipline);

    const attempt: Attempt = CrudAdapter.insertItem(this.collectionKey, {
      discipline,
      date: new Date(),
      raw: athleteResolver.raw(athlete),
      ...data,
      index: existingAttempts.length,
      athleteId
    });

    this.autoUpdateTotalAndPoints(athleteId);

    if (publish) {
      publish({ slotId: athleteGroup.slotId });
    }
    return attempt;
  }

  @Mutation()
  public updateAttempt(
    @Args() { id }: IdArgs,
    @Arg("data") data: AttemptUpdateInput,
    @Arg("skipAutoCalc", { nullable: true }) skipAutoCalc: boolean,
    @Ctx() ctx: Context,
    @PubSub("UPDATE_NEXT_ATHLETE_NOTIFICATIONS")
    publish: Publisher<{ slotId: string }>
  ): Attempt {
    const updateData = {
      ...data
    };
    if (data.done) {
      updateData.date = new Date();
    }

    const attempt: Attempt = CrudAdapter.updateItem(
      this.collectionKey,
      id,
      updateData
    );
    const athletesResolver = new AthletesResolver();
    const athlete = athletesResolver.athlete({ id: attempt.athleteId });
    const athleteGroup = CrudAdapter.getItem(
      AthleteGroup.collectionKey,
      athlete.athleteGroupId
    );
    if (!skipAutoCalc) {
      this.autoUpdateTotalAndPoints(attempt.athleteId);
    }
    publish({ slotId: athleteGroup.slotId });
    return attempt;
  }

  @Mutation()
  public autoCalcAthletePoints(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context
  ): boolean {
    this.autoUpdateTotalAndPoints(id);
    return true;
  }

  @Mutation()
  public autoCalcEventPoints(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context
  ): boolean {
    const eventsResolver = new EventsResolver();
    const eventResolver = new EventResolver();
    const event = eventsResolver.event({ id });
    const athletes = eventResolver.athletes(event);
    athletes.forEach(athlete => {
      this.autoUpdateTotalAndPoints(athlete.id);
    });

    return true;
  }

  public autoUpdateTotalAndPoints(athleteId: string): Athlete | void {
    const athletesResolver = new AthletesResolver();
    const athleteResolver = new AthleteResolver();
    const athlete = athletesResolver.athlete({ id: athleteId });
    if (!athlete) {
      return null;
    }
    const bestAttempts = athleteResolver.bestAttempts(athlete);

    const nextAttempts = athleteResolver.nextAttempts(athlete);

    const total: number = bestAttempts
      .map(item => item.weight)
      .reduce((pv, cv) => pv + cv, 0);

    const nextAttemptsSortKeys = nextAttempts.reduce(
      (acc, attempt: Attempt) => ({
        ...acc,
        [attempt.discipline]: attempt
          ? `${attempt.index}-${100000 + attempt.weight}`
          : "999999"
      }),
      {}
    );

    const updateData: any = {
      nextAttemptsSortKeys,
      points: null,
      total: null
    };

    if (!_.isNaN(total) && total > 0) {
      const points = this.calcAthletePoints(athlete, total);
      updateData.points = points;
      updateData.total = points ? total : null;
      updateData.latestBestAttemptsDate = _.chain(bestAttempts)
        .orderBy(["date"], ["desc"])
        .first()
        .get("date")
        .value();
    }
    return athletesResolver.updateAthlete({ id: athleteId }, updateData, null);
  }

  @Mutation()
  public deleteAttempt(@Args() { id }: IdArgs, @Ctx() ctx: Context): Attempt {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }

  @Mutation()
  public removeAllAttempts(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context
  ): boolean {
    const eventsResolver = new EventsResolver();
    const eventResolver = new EventResolver();
    const athleteResolver = new AthleteResolver();

    const event = eventsResolver.event({ id });
    const athletes = eventResolver.athletes(event);

    athletes.forEach(athlete => {
      const existingAttempts = athleteResolver.getAttempts(athlete.id);
      existingAttempts.forEach(item => {
        this.deleteAttempt({ id: item.id }, ctx);
      });
    });

    return true;
  }

  @Mutation()
  public simulateAttempts(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context,
    @PubSub("UPDATE_NEXT_ATHLETE_NOTIFICATIONS")
    publish: Publisher<{ slotId: string }>
  ): boolean {
    const eventsResolver = new EventsResolver();
    const eventResolver = new EventResolver();
    const athleteResolver = new AthleteResolver();
    const athletesResolver = new AthletesResolver();

    const event = eventsResolver.event({ id });
    const athletes = eventResolver.athletes(event);

    athletes.forEach(athlete => {
      const disciplines = [];

      if (!athlete.bodyWeight) {
        athletesResolver.updateAthlete(
          { id: athlete.id },
          {
            bodyWeight: 85
          },
          ctx
        );
      }

      if (event.discipline === Discipline.POWERLIFTING) {
        disciplines.push(Discipline.BENCHPRESS);
        disciplines.push(Discipline.SQUAT);
        disciplines.push(Discipline.DEADLIFT);
      } else {
        disciplines.push(event.discipline);
      }

      disciplines.forEach(discipline => {
        const existingAttempts = athleteResolver.getAttempts(
          athlete.id,
          discipline
        );
        if (!existingAttempts.length) {
          for (let i = 0; i < 3; i++) {
            this.createAttempt(
              {
                athleteId: athlete.id,
                data: {
                  done: true,
                  valid: Math.random() < 0.5,
                  weight: Math.floor(Math.random() * 200) + 100
                },
                discipline
              },
              ctx,
              publish
            );
          }
        }
      });
    });

    return true;
  }

  private calcAthletePoints(athlete: Athlete, total) {
    const athleteResolver = new AthleteResolver();
    const valid = athleteResolver.valid(athlete);
    if (!valid) {
      return null;
    }
    return athlete.dots ? athlete.dots * total : null;
  }
}
