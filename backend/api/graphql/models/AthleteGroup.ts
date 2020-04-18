import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'AthleteGroup',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.name()
      t.model.event()
      t.model.eventId()
      t.model.slot()
      t.model.slotId()
    },
  })
}
