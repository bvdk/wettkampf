import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'Slot',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.name()
      t.model.event()
      t.model.eventId()
    },
  })
}
