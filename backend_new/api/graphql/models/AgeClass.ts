import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'AgeClass',
    definition(t) {
      t.model.id()
      t.model.name()
      t.model.sortId()
    },
  })
}
