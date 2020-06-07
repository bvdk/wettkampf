import { schema } from 'nexus'

export default () => {
  schema.objectType({
    name: 'OfficialSlot',
    definition(t) {
      t.model.id()
      t.model.createdAt()
      t.model.updatedAt()
      t.model.position()
      t.model.official()
      t.model.officialId()
      t.model.slot()
      t.model.slotId()
    },
  })
}
