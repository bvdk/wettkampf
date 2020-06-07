import { schema } from 'nexus'

export default () => {
  schema.enumType({
    name: 'Position',
    members: ['SEITENKAMPFRICHTER'],
  })
}
