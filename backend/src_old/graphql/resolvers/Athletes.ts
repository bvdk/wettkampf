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
  Query,
  Resolver
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import dots from "../../utils/dots";
import wilks from "../../utils/wilks";
import { Athlete, AthleteInput, AthleteUpdateInput } from "../models/athlete";
import { Event } from "../models/event";
import { IdArgs } from "./args/IdArgs";
import AthleteResolver from "./Athlete";
import AttemptsResolver from "./Attempts";
import EventResolver from "./Event";
import EventsResolver from "./Events";

@ArgsType()
class CreateAthleteArgs {
  @Field(type => ID)
  public eventId: string;

  @Field(type => AthleteInput)
  public data: AthleteInput;
}

@ArgsType()
class FindAthleteArgs {
  @Field(type => ID, { nullable: true })
  public eventId?: string;

  @Field(type => ID, { nullable: true })
  public importId?: string;
}

@Resolver()
export default class AthletesResolver {
  private collectionKey: string = Athlete.collectionKey;

  @Query(returns => [Athlete])
  public athletes(): Athlete[] {
    return CrudAdapter.getAll(this.collectionKey);
  }

  @Query(returns => Athlete)
  public athlete(@Args() { id }: IdArgs): Athlete {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Query(returns => Athlete)
  public findAthlete(@Args() args: FindAthleteArgs): Athlete {
    return CrudAdapter.find(this.collectionKey, args);
  }

  @Mutation()
  public createAthlete(
    @Args() { data, eventId }: CreateAthleteArgs,
    @Ctx() ctx: Context
  ): Athlete {
    const athlete = CrudAdapter.insertItem(this.collectionKey, {
      ...data,
      eventId
    });

    const eventResolver = new EventResolver();
    const event = CrudAdapter.find(Event.collectionKey, { id: eventId });
    const disciplines = eventResolver.availableDisciplines(event);

    this.autoUpdateWilks(athlete.id, athlete);
    this.autoCreateAttempt(athlete, disciplines, ctx);

    return athlete;
  }

  @Mutation()
  public updateAthlete(
    @Args() { id }: IdArgs,
    @Arg("data") data: AthleteUpdateInput,
    @Ctx() ctx: Context
  ): Athlete {
    this.autoUpdateWilks(id, data);
    this.autoUpdateDots(id, data);
    const updateResult = CrudAdapter.updateItem(this.collectionKey, id, data);

    this.postUpdate(data, updateResult);

    return updateResult;
  }

  public autoUpdateWilks(id: string, input: any): Athlete | void {
    const athlete = this.athlete({ id });
    const updateProps = Object.keys(input);
    const wilksUpdateProps = ["bodyWeight", "gender"];
    const shouldUpdateWilks = wilksUpdateProps.reduce((acc, cur) => {
      if (acc) {
        return acc;
      }
      return updateProps.indexOf(cur) > -1;
    }, false);

    if (shouldUpdateWilks) {
      const result = CrudAdapter.updateItem(this.collectionKey, id, {
        wilks: wilks(
          _.get(input, "gender", athlete.gender),
          _.get(input, "bodyWeight", athlete.bodyWeight)
        )
      });

      const attemptsResolver = new AttemptsResolver();
      attemptsResolver.autoUpdateTotalAndPoints(athlete.id);

      return result;
    }

    return null;
  }

  public autoUpdateDots(id: string, input: any): Athlete | void {
    const athlete = this.athlete({ id });
    const updateProps = Object.keys(input);
    const dotsUpdateProps = ["bodyWeight", "gender"];
    const shouldUpdateDots = dotsUpdateProps.reduce((acc, cur) => {
      if (acc) {
        return acc;
      }
      return updateProps.indexOf(cur) > -1;
    }, false);

    if (shouldUpdateDots) {
      const result = CrudAdapter.updateItem(this.collectionKey, id, {
        dots: dots(
          _.get(input, "gender", athlete.gender),
          _.get(input, "bodyWeight", athlete.bodyWeight)
        )
      });

      const attemptsResolver = new AttemptsResolver();
      attemptsResolver.autoUpdateTotalAndPoints(athlete.id);

      return result;
    }

    return null;
  }

  public autoCreateAttempt(athlete: Athlete, disciplines, ctx) {
    const attemptsResolver = new AttemptsResolver();
    disciplines.forEach(discipline => {
      [0, 1, 2].forEach(() =>
        attemptsResolver.createAttempt(
          {
            data: {},
            athleteId: athlete.id,
            discipline
          },
          ctx
        )
      );
    });
  }

  @Mutation()
  public deleteAthlete(@Args() { id }: IdArgs, @Ctx() ctx: Context): Athlete {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }

  public calcPlaces(resultClassId: string, eventId: string) {
    if (!resultClassId || !eventId) {
      return null;
    }

    const eventResolver = new EventResolver();
    const eventsResolver = new EventsResolver();
    const event = eventsResolver.event({ id: eventId });
    const athletes = eventResolver.athletes(event, undefined, {
      filters: [{ index: "resultClassId", value: [resultClassId] }]
    });

    _.chain(athletes)
      .filter(athlete => !!athlete.points)
      .orderBy(
        ["total", "bodyWeight", "latestBestAttemptsDate"],
        ["desc", "asc", "asc"]
      )
      .map((athlete, index) =>
        CrudAdapter.updateItem(this.collectionKey, athlete.id, {
          place: index + 1
        })
      )
      .value();

    _.chain(athletes)
      .filter(athlete => !athlete.points)
      .map(athlete =>
        CrudAdapter.updateItem(this.collectionKey, athlete.id, {
          place: null
        })
      )
      .value();
  }

  private postUpdate(updateObject, athlete: Athlete) {
    const keys = Object.keys(updateObject);
    if (keys.indexOf("points")) {
      const athleteResolver = new AthleteResolver();
      this.calcPlaces(
        athleteResolver.resultClassIdFromAthlete(athlete),
        athlete.eventId
      );
    }
  }
}
