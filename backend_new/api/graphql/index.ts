import ContestType from './enums/ContestType'
import Discipline from './enums/Discipline'
import Gender from './enums/Gender'
import Position from './enums/Position'
import Role from './enums/Role'

import AgeClass from './models/AgeClass'
import Athlete from './models/Athlete'
import AthleteGroup from './models/AthleteGroup'
import Attempt from './models/Attempt'
import Event from './models/Event'
import Official from './models/Official'
import OfficialSlot from './models/OfficialSlot'
import Slot from './models/Slot'
import User from './models/User'
import WeightClass from './models/WeightClass'

import Query from './Query'
import Mutation from './Mutation'

export default () => {
  ContestType()
  Discipline()
  Gender()
  Position()
  Role()

  AgeClass()
  Athlete()
  AthleteGroup()
  Attempt()
  Event()
  Official()
  OfficialSlot()
  Slot()
  User()
  WeightClass()

  Query()
  Mutation()
}
