const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
}
export declare type Gender = typeof Gender[keyof typeof Gender]

export type WeightClass = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  gender: Gender
  min: number
  max: number
}

const weightClassesMock: Omit<WeightClass, 'createdAt' | 'updatedAt'>[] = [
  {
    gender: Gender.MALE,
    id: '-53',
    max: 53,
    min: 0,
    name: 'bis 53 Kg',
  },
  {
    id: '-59',
    name: 'bis 59 Kg',
    gender: Gender.MALE,
    min: 0,
    max: 55,
  },
  {
    id: '-66',
    name: 'bis 66 Kg',
    gender: Gender.MALE,
    min: 59.01,
    max: 66,
  },
  {
    id: '-74',
    name: 'bis 74 Kg',
    gender: Gender.MALE,
    min: 66.01,
    max: 74,
  },
  {
    id: '-83',
    name: 'bis 83 Kg',
    gender: Gender.MALE,
    min: 74.01,
    max: 83,
  },
  {
    id: '-93',
    name: 'bis 93 Kg',
    gender: Gender.MALE,
    min: 83.01,
    max: 93,
  },
  {
    id: '-105',
    name: 'bis 105 Kg',
    gender: Gender.MALE,
    min: 93.01,
    max: 105,
  },
  {
    id: '-120',
    name: 'bis 120 Kg',
    gender: Gender.MALE,
    min: 105.01,
    max: 120,
  },
  {
    id: '+120',
    name: 'ab 120 Kg',
    gender: Gender.MALE,
    min: 120.01,
    max: 999,
  },
  {
    id: '-43',
    name: 'bis 43 Kg',
    gender: Gender.FEMALE,
    min: 0,
    max: 43,
  },
  {
    id: '-47',
    name: 'bis 47 Kg',
    gender: Gender.FEMALE,
    min: 0,
    max: 47,
  },
  {
    id: '-52',
    name: 'bis 52 Kg',
    gender: Gender.FEMALE,
    min: 47.01,
    max: 52,
  },
  {
    id: '-57',
    name: 'bis 57 Kg',
    gender: Gender.FEMALE,
    min: 52.01,
    max: 57,
  },
  {
    id: '-63',
    name: 'bis 63 Kg',
    gender: Gender.FEMALE,
    min: 52.01,
    max: 63,
  },
  {
    id: '-72',
    name: 'bis 72 Kg',
    gender: Gender.FEMALE,
    min: 63.01,
    max: 72,
  },
  {
    id: '-84',
    name: 'bis 84 Kg',
    gender: Gender.FEMALE,
    min: 72.01,
    max: 84,
  },
  {
    id: '+84',
    name: 'ab 84 Kg',
    gender: Gender.FEMALE,
    min: 84.01,
    max: 999,
  },
]

export default weightClassesMock
