import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'WeightClass',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.name()
      t.model.gender()
      t.model.min()
      t.model.max()
    },
  })
}
