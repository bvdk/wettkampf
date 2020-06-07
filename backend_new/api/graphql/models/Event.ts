import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'Event',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.name()
      t.model.discipline()
      t.model.contestType()
    },
  })
}
