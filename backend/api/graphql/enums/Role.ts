import { schema } from 'nexus'

export default () => {
  schema.enumType({
    name: 'Role',
    members: ['ADMIN', 'USER', 'GUEST'],
  })
}
