import { schema } from 'nexus'

export default () => {
  schema.enumType({
    name: 'Gender',
    members: ['MALE', 'FEMALE'],
  })
}
