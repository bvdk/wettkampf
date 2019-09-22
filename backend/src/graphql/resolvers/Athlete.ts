import _ from "lodash";
import {
  Arg,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { AgeClass } from "../models/ageClass";
import { Athlete } from "../models/athlete";
import { AthleteGroup } from "../models/athleteGroup";
import { Attempt } from "../models/attempt";
import { Discipline } from "../models/discipline";
import { ResultClass } from "../models/resultClass";
import { Slot } from "../models/slot";
import { WeightClass } from "../models/weightClass";
import AttemptsResolver from "./Attempts";

function _calculateAge(birthday: Date): number {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

@Resolver(of => Athlete)
export default class AthleteResolver implements ResolverInterface<Athlete> {
  public getAttempts(athleteId: string, discipline?: Discipline) {
    const attempts = _.orderBy(
      CrudAdapter.filter(Attempt.collectionKey, { athleteId }),
      ["discipline", "asc"],
      ["index", "asc"]
    );
    if (discipline) {
      return _.filter(attempts, { discipline });
    }
    return attempts;
  }

  @FieldResolver()
  public firstName(@Root() athlete: Athlete) {
    return _.get(athlete, "firstName", "");
  }

  @FieldResolver()
  public lastName(@Root() athlete: Athlete) {
    return _.get(athlete, "lastName", "");
  }

  @FieldResolver()
  public name(@Root() athlete: Athlete) {
    const firstName = this.firstName(athlete);
    const lastName = this.lastName(athlete);
    if (firstName && lastName) {
      return `${lastName}, ${firstName}`;
    }
    return firstName || lastName;
  }

  @FieldResolver()
  public age(@Root() athlete: Athlete) {
    const birtday = this.birthday(athlete);
    return birtday ? _calculateAge(birtday) : null;
  }

  @FieldResolver()
  public birthday(@Root() athlete: Athlete) {
    const { birthday } = athlete;
    if (birthday) {
      if (typeof birthday === "string") {
        const parts = birthday.match(/(\d+)/g);
        const parsedParts = parts.map(p => parseInt(p, 10));
        return new Date(parsedParts[2], parsedParts[1] - 1, parsedParts[0]);
      }
      return new Date(birthday);
    }
    return null;
  }

  @FieldResolver()
  public slot(@Root() athlete: Athlete) {
    const athleteGroup = this.athleteGroup(athlete);
    const slotId = _.get(athleteGroup, "slotId");
    if (slotId) {
      return CrudAdapter.getItem(Slot.collectionKey, slotId);
    }
    return null;
  }

  @FieldResolver()
  public athleteGroup(@Root() athlete: Athlete) {
    if (athlete.athleteGroupId) {
      return CrudAdapter.getItem(
        AthleteGroup.collectionKey,
        athlete.athleteGroupId
      );
    }
    return null;
  }

  @FieldResolver()
  public attemptCount(@Root() athlete: Athlete) {
    return _.size(this.attempts(athlete));
  }

  @FieldResolver()
  public attempts(
    @Root() athlete: Athlete,
    @Arg("discipline", type => Discipline, { nullable: true })
    discipline?: Discipline
  ) {
    return this.getAttempts(athlete.id, discipline);
  }

  @FieldResolver()
  public bestAttempts(
    @Root() athlete: Athlete,
    @Arg("discipline", type => Discipline, { nullable: true })
    discipline?: Discipline
  ) {
    return _.chain(this.attempts(athlete, discipline))
      .filter({
        valid: true
      })
      .groupBy("discipline")
      .map((attempts, key) => {
        return _.chain(attempts)
          .orderBy(["weight"], ["desc"])
          .first()
          .value();
      })
      .filter(item => item)
      .value();
  }

  @FieldResolver()
  public valid(@Root() athlete: Athlete) {
    return _.chain(this.attempts(athlete))
      .groupBy("discipline")
      .map((group, key) => {
        return group.reduce((acc, cur) => {
          if (acc) {
            return acc;
          }
          return cur.valid || !cur.done;
        }, false);
      })
      .reduce((acc, cur) => {
        if (!acc) {
          return acc;
        }
        return cur;
      }, true)
      .value();
  }

  @FieldResolver()
  public nextAttempts(
    @Root() athlete: Athlete,
    @Arg("discipline", type => Discipline, { nullable: true })
    discipline?: Discipline
  ) {
    return _.chain(this.attempts(athlete, discipline))
      .sortBy(["index"])
      .filter((attempt: Attempt) => !attempt.done)
      .groupBy("discipline")
      .map(group => _.first(group))
      .value();
  }

  @FieldResolver()
  public ageClass(@Root() athlete: Athlete) {
    if (athlete.ageClassId) {
      return CrudAdapter.getItem(AgeClass.collectionKey, athlete.ageClassId);
    }
    return null;
  }

  @FieldResolver()
  public weightClass(@Root() athlete: Athlete) {
    if (athlete.weightClassId) {
      return CrudAdapter.getItem(
        WeightClass.collectionKey,
        athlete.weightClassId
      );
    }
    return null;
  }

  @FieldResolver()
  public wilks(@Root() athlete: Athlete) {
    // if (!athlete.wilks) {
    //     const resolver = new AthletesResolver();
    //     const result = resolver.autoUpdateWilks(athlete.id, athlete);
    //     return _.get(result, "wilks");
    // }
    return athlete.wilks ? Math.round(athlete.wilks * 10000) / 10000 : null;
  }

  @FieldResolver()
  public raw(@Root() athlete: Athlete) {
    return !!athlete.raw;
  }

  @FieldResolver()
  public total(@Root() athlete: Athlete) {
    if (!athlete.total) {
      const resolver = new AttemptsResolver();
      const result = resolver.autoUpdateTotalAndPoints(athlete.id);
      return _.get(result, "total");
    }
    return athlete.total;
  }

  @FieldResolver()
  public points(@Root() athlete: Athlete) {
    let tmp = null;
    if (!athlete.points) {
      const resolver = new AttemptsResolver();
      const result = resolver.autoUpdateTotalAndPoints(athlete.id);
      tmp = _.get(result, "points");
    } else {
      tmp = athlete.points;
    }
    return tmp ? Math.round(tmp * 100) / 100 : null;
  }

  public resultClassIdFromAthlete(athlete: Athlete) {
    const keyComponents = ["gender", "weightClassId", "ageClassId", "raw"];

    return keyComponents
      .map(key => athlete[key])
      .filter(item => item)
      .join("-");
  }

  @FieldResolver()
  public resultClass(@Root() athlete: Athlete) {
    const resultClass: ResultClass = {
      ageClassId: athlete.ageClassId,
      gender: athlete.gender,
      id: this.resultClassIdFromAthlete(athlete),
      raw: athlete.raw,
      weightClassId: athlete.weightClassId
    };

    return resultClass;
  }
}
