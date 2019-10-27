import { Context } from "graphql-yoga/dist/types";
import _ from "lodash";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { arrayMove } from "../../utils/arrayMove";
import createAutoCreateAthleteGroups from "../../utils/autoCreateAthleteGroups";
import { Athlete } from "../models/athlete";
import { AthleteGroup, AthleteGroupInput } from "../models/athleteGroup";
import {
  AthleteGroupCreationKey,
  AthleteGroupCreationResult
} from "../models/athleteGroupCreationResult";
import { FilterInput } from "../models/filter";
import { SortDirection, SortInput } from "../models/sort";
import AgeClassesResolver from "./AgeClasses";
import FilterArgs from "./args/FilterArgs";
import { IdArgs } from "./args/IdArgs";
import SortArgs from "./args/SortArgs";
import EventResolver from "./Event";
import EventsResolver from "./Events";
import WeightClassesResolver from "./WeightClasses";

@ArgsType()
class CreateAthleteGroupArgs {
  @Field(type => ID)
  public eventId: string;

  @Field(type => ID, { nullable: true })
  public slotId: string;

  @Field(type => AthleteGroupInput)
  public data?: AthleteGroupInput;
}

@ArgsType()
class SetAthleteGroupSlotArgs {
  @Field(type => ID)
  public athleteGroupId: string;

  @Field(type => ID)
  public slotId: string;
}

@ArgsType()
class AthleteGroupSortArgs {
  @Field(type => ID)
  public slotId: string;

  @Field(type => Int)
  public oldIndex: number;

  @Field(type => Int)
  public newIndex: number;
}

@ArgsType()
class AthleteGroupCreationArgs {
  @Field(type => [ID], {
    description:
      "Wenn nicht gewählt werden alle Athleten ohne Startgruppe verwendet.",
    nullable: true
  })
  public athleteIds?: [string];

  @Field(type => ID)
  public eventId?: string;

  @Field(type => [AthleteGroupCreationKey])
  public keys?: AthleteGroupCreationKey[];

  @Field(type => Int, {
    description:
      "Maximale Startgruppengröße, wenn 0 werden alle passenden Athleten in eine Gruppe gespeichert.",
    nullable: true
  })
  public maxGroupSize?: number;

  @Field(type => Boolean, {
    description: "Wenn true werden bestehende Startgruppen mit einbezogen",
    nullable: true
  })
  public useExisting?: boolean;

  @Field(type => Boolean, {
    description: "Gruppen auf bestehende Bühnen verteilen",
    nullable: true
  })
  public distributeSlots?: boolean;
}

@ArgsType()
class AddAthletesToAthleteGroupArgs {
  @Field(type => ID)
  public athleteGroupId: string;

  @Field(type => [ID])
  public athleteIds: string[];
}

@Resolver()
export default class AthleteGroupsResolver {
  private collectionKey: string = AthleteGroup.collectionKey;

  @Query(returns => AthleteGroup)
  public athleteGroup(@Args() { id }: IdArgs): AthleteGroup {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Query(returns => AthleteGroup)
  public athleteGroups(
    @Args() { filters }: FilterArgs,
    @Args() { sort }: SortArgs
  ): AthleteGroup[] {
    return SortInput.performSort(
      CrudAdapter.filter(
        this.collectionKey,
        FilterInput.convertToFilterObject(filters)
      ),
      sort
    );
  }

  @Mutation()
  public createAthleteGroup(
    @Args() { data, slotId, eventId }: CreateAthleteGroupArgs,
    @Ctx() ctx: Context
  ): AthleteGroup {
    if (!slotId) {
      const eventsResolver = new EventsResolver();
      const event = eventsResolver.event({ id: eventId });
      const eventResolver = new EventResolver();
      const slots = eventResolver.slots(event);
      slotId = _.chain(slots)
        .first()
        .get("id")
        .value();
    }

    return CrudAdapter.insertItem(this.collectionKey, {
      ...data,
      eventId,
      slotId
    });
  }

  @Mutation()
  public updateAthleteGroup(
    @Args() { id }: IdArgs,
    @Arg("data") data: AthleteGroupInput,
    @Ctx() ctx: Context
  ): AthleteGroup {
    return CrudAdapter.updateItem(this.collectionKey, id, data);
  }

  @Mutation(type => AthleteGroup)
  public updateAthleteGroupSort(
    @Args() { slotId, newIndex, oldIndex }: AthleteGroupSortArgs,
    @Ctx() ctx: Context
  ): AthleteGroup[] {
    const getAthleteGroups = (): AthleteGroup[] => {
      return this.athleteGroups(
        {
          filters: [{ value: [slotId], index: "slotId" }]
        },
        {
          sort: [{ direction: SortDirection.ASC, name: "sortId" }]
        }
      );
    };

    const list = arrayMove(getAthleteGroups(), oldIndex, newIndex).filter(
      item => item
    );
    list.forEach((item, index) => {
      CrudAdapter.updateItem(this.collectionKey, item.id, { sortId: index });
    });

    return getAthleteGroups();
  }

  @Mutation()
  public setAthleteGroupSlot(
    @Args() { athleteGroupId, slotId }: SetAthleteGroupSlotArgs,
    @Ctx() ctx: Context
  ): AthleteGroup {
    return CrudAdapter.updateItem(this.collectionKey, athleteGroupId, {
      slotId
    });
  }

  @Mutation(type => AthleteGroup)
  public addAthletesToAthleteGroup(
    @Args() { athleteGroupId, athleteIds }: AddAthletesToAthleteGroupArgs,
    @Ctx() ctx: Context
  ): AthleteGroup {
    const athletes = athleteIds.map((athleteId: string) =>
      CrudAdapter.updateItem(Athlete.collectionKey, athleteId, {
        athleteGroupId
      })
    );
    return this.athleteGroup({ id: athleteGroupId });
  }

  @Mutation(type => AthleteGroup)
  public removeAthletesFromAthleteGroup(
    @Args() { athleteGroupId, athleteIds }: AddAthletesToAthleteGroupArgs,
    @Ctx() ctx: Context
  ): AthleteGroup {
    const athletes = athleteIds.map((athleteId: string) =>
      CrudAdapter.updateItem(Athlete.collectionKey, athleteId, {
        athleteGroupId: null
      })
    );
    return this.athleteGroup({ id: athleteGroupId });
  }

  @Mutation()
  public deleteAthleteGroup(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context
  ): AthleteGroup {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }

  @Query()
  public autoCreateAthleteGroupsPreview(
    @Args() args: AthleteGroupCreationArgs
  ): AthleteGroupCreationResult {
    return this.autoCreateAthleteGroups(args, null, true);
  }

  @Mutation()
  public autoCreateAthleteGroups(
    @Args()
    {
      athleteIds,
      distributeSlots,
      useExisting,
      eventId,
      keys,
      maxGroupSize
    }: AthleteGroupCreationArgs,
    @Ctx() ctx: Context,
    preview: boolean
  ): AthleteGroupCreationResult {
    const eventResolver = new EventResolver();
    let athletes = eventResolver.getEventAthletes(eventId);
    if (athleteIds && athleteIds.length) {
      athletes = athletes.filter(
        (item: Athlete) => athleteIds.indexOf(item.id) > -1
      );
    } else {
      athletes = athletes.filter((item: Athlete) => !item.athleteGroupId);
    }

    let athleteGroups = [];
    if (useExisting) {
      athleteGroups = eventResolver.getEventAthleteGroups(eventId);
    }

    let slots = eventResolver.getEventSlots(eventId);
    if (!distributeSlots) {
      const firstSlot = _.first(slots);
      if (firstSlot) {
        slots = [firstSlot];
      } else {
        slots = [];
      }
    }
    const ageClassesResolver = new AgeClassesResolver();
    const ageClasses = ageClassesResolver.ageClasses();

    const weightClassesResolver = new WeightClassesResolver();
    const weightClasses = weightClassesResolver.weightClasses();

    const autoCreateAthleteGroups = createAutoCreateAthleteGroups({
      ageClasses,
      athleteGroups,
      athletes,
      keys,
      maxGroupSize,
      slots,
      weightClasses
    });

    if (preview) {
      return {
        athleteGroups: autoCreateAthleteGroups,
        athletes,
        keys
      };
    }

    const createdAthleteGroups = autoCreateAthleteGroups.map(athleteGroup => {
      let createdAthleteGroup = athleteGroup;
      if (athleteGroup.shallow) {
        createdAthleteGroup = this.createAthleteGroup(
          {
            data: {
              ageClassId: athleteGroup.ageClassId,
              gender: athleteGroup.gender,
              name: athleteGroup.name,
              weightClassId: athleteGroup.weightClassId
            },
            eventId,
            slotId: athleteGroup.slotId
          },
          ctx
        );
      }

      return this.addAthletesToAthleteGroup(
        {
          athleteGroupId: createdAthleteGroup.id,
          athleteIds: athleteGroup.athletes.map((item: Athlete) => item.id)
        },
        ctx
      );
    });

    return {
      athleteGroups: createdAthleteGroups,
      athletes,
      keys
    };
  }
}
