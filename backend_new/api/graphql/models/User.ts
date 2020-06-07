import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'User',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.role()
      t.model.username()
      t.model.passwordHash()
      t.model.salt()
    },
  })
}
