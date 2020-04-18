import { schema } from 'nexus'

export default () => {
  schema.enumType({
    name: 'Discipline',
    members: ['POWERLIFTING', 'SQUAT', 'BENCHPRESS', 'DEADLIFT'],
  })
}
