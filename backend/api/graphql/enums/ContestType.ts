import { schema } from 'nexus'

export default () => {
  schema.enumType({
    name: 'ContestType',
    members: ['SINGLE', 'TEAM'],
  })
}
