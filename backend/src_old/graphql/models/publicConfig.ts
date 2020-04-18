import { flatten, groupBy } from "lodash";
import { Field, ObjectType } from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Athlete } from "./athlete";
import { AthleteGroup } from "./athleteGroup";
import { Event } from "./event";
import { FilterInput } from "./filter";
import { Slot } from "./slot";

const calcNextAthletes = (
  slot: Slot,
  event: Event,
  slotAthletes: Athlete[],
  filters: FilterInput[]
) => {
  let athleteGroupIds: string[] = [];
  if (filters) {
    const athleteGroups = filters.find(f => f.index === "athleteGroupId");
    if (athleteGroups) {
      athleteGroupIds = athleteGroups.value;
    }
  }

  const filteredSlotAthletes = slotAthletes.filter(a => a.bodyWeight);
  const athleteGroupedAthletes = groupBy(
    filteredSlotAthletes,
    "athleteGroupId"
  );

  const entries = Object.entries(athleteGroupedAthletes)
    .filter(entry => athleteGroupIds.includes(entry[0]))
    .map(entry => {
      return entry[1];
    });
  return flatten(entries);
};

@ObjectType()
export class PublicConfig {
  @Field(type => Event)
  public event: Event;

  @Field(type => String)
  public discipline: string;

  @Field(type => Slot)
  public slot: Slot;

  @Field(type => [Athlete])
  public nextAthletes: Athlete[];

  @Field(type => [AthleteGroup])
  public athleteGroups: AthleteGroup[];

  public getEvent(): Event {
    return this.event;
  }

  public setEvent(event: Event): void {
    this.event = event;
  }

  public getDiscipline(): string {
    return this.discipline;
  }

  public setDiscipline(discipline: string): void {
    this.discipline = discipline;
  }

  public getSlot(): Slot {
    return this.slot;
  }

  public setSlot(slot: Slot): void {
    this.slot = slot;
  }

  public getNextAthletes(): Athlete[] {
    return this.nextAthletes;
  }

  public setNextAthletes(): void {
    const athleteGroupIds = this.athleteGroups.map(item => item.id);
    const athletes =
      CrudAdapter.filter(Athlete.collectionKey, athlete => {
        return athleteGroupIds.indexOf(athlete.athleteGroupId) !== -1;
      }) || [];

    const filters = [];
    filters.push({
      value: athleteGroupIds,
      index: "athleteGroupId"
    });
    this.nextAthletes = calcNextAthletes(
      this.slot,
      this.event,
      athletes,
      filters
    );
  }

  public getAthleteGroups(): AthleteGroup[] {
    return this.athleteGroups;
  }

  public setAthleteGroups(athleteGroups: AthleteGroup[]): void {
    this.athleteGroups = athleteGroups;
  }
}
