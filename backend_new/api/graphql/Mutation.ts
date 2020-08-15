import { schema } from 'nexus'

export default () => {
  schema.mutationType({
    definition(t) {
      t.crud.createOneAgeClass()
      t.crud.deleteOneAgeClass()
      t.crud.deleteManyAgeClass()
      t.crud.updateOneAgeClass()
      t.crud.updateManyAgeClass()
      t.crud.upsertOneAgeClass()

      t.crud.createOneAthlete()
      t.crud.deleteOneAthlete()
      t.crud.deleteManyAthlete()
      t.crud.updateOneAthlete()
      t.crud.updateManyAthlete()
      t.crud.upsertOneAthlete()

      t.crud.createOneAthleteGroup()
      t.crud.deleteOneAthleteGroup()
      t.crud.deleteManyAthleteGroup()
      t.crud.updateOneAthleteGroup()
      t.crud.updateManyAthleteGroup()
      t.crud.upsertOneAthleteGroup()

      t.crud.createOneAttempt()
      t.crud.deleteOneAttempt()
      t.crud.deleteManyAttempt()
      t.crud.updateOneAttempt()
      t.crud.updateManyAttempt()
      t.crud.upsertOneAttempt()

      t.crud.createOneEvent()
      t.crud.deleteOneEvent()
      t.crud.deleteManyEvent()
      t.crud.updateOneEvent()
      t.crud.updateManyEvent()
      t.crud.upsertOneEvent()

      t.crud.createOneOfficial()
      t.crud.deleteOneOfficial()
      t.crud.deleteManyOfficial()
      t.crud.updateOneOfficial()
      t.crud.updateManyOfficial()
      t.crud.upsertOneOfficial()

      t.crud.createOneOfficialSlot()
      t.crud.deleteOneOfficialSlot()
      t.crud.deleteManyOfficialSlot()
      t.crud.updateOneOfficialSlot()
      t.crud.updateManyOfficialSlot()
      t.crud.upsertOneOfficialSlot()

      t.crud.createOneSlot()
      t.crud.deleteOneSlot()
      t.crud.deleteManySlot()
      t.crud.updateOneSlot()
      t.crud.updateManySlot()
      t.crud.upsertOneSlot()

      t.crud.createOneUser()
      t.crud.deleteOneUser()
      t.crud.deleteManyUser()
      t.crud.updateOneUser()
      t.crud.updateManyUser()
      t.crud.upsertOneUser()

      t.crud.createOneWeightClass()
      t.crud.deleteOneWeightClass()
      t.crud.deleteManyWeightClass()
      t.crud.updateOneWeightClass()
      t.crud.updateManyWeightClass()
      t.crud.upsertOneWeightClass()
    },
  })
}