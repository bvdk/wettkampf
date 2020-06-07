import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'Attempt',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.discipline()
      t.model.date()
      t.model.index()
      t.model.weight()
      t.model.raw()
      t.model.valid()
      t.model.done()
      t.model.resign()
      t.model.athlete()
      t.model.athleteId()
    },
  })
}
