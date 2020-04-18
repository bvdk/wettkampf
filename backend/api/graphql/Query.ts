import { schema } from 'nexus'

export default () => {
  schema.queryType({
    definition(t) {
      t.crud.ageClass()
      t.crud.ageClasses()
      t.crud.athlete()
      t.crud.athletes()
      t.crud.athleteGroup()
      t.crud.athleteGroups()
      t.crud.attempt()
      t.crud.attempts()
      t.crud.event()
      t.crud.events()
      t.crud.official()
      t.crud.officials()
      t.crud.officialSlot()
      t.crud.officialSlots()
      t.crud.slot()
      t.crud.slots()
      t.crud.user()
      t.crud.users()
      t.crud.weightClass()
      t.crud.weightClasses()
    },
  })
}