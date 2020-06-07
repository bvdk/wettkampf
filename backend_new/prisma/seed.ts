import { PrismaClient } from '@prisma/client'
import ageClasses from '../api/mocks/ageClasses'
import weightClasses from '../api/mocks/weightClasses'

const main = async () => {
  const db = new PrismaClient()

  const ageClassUpsertPromises = ageClasses.map((ageClass) =>
    db.ageClass.create({ data: ageClass }),
  )

  const weightClassUpsertPromises = weightClasses.map((weightClass) =>
    db.weightClass.create({ data: weightClass }),
  )

  await Promise.all(ageClassUpsertPromises)
  await Promise.all(weightClassUpsertPromises)
  // const results = await Promise.all(
  //   [
  //     {
  //       name: 'Earth',
  //       population: 6_000_000_000,
  //     },
  //     {
  //       name: 'Mars',
  //       population: 0,
  //     },
  //   ].map(data => db.world.create({ data })),
  // )
  //
  // console.log('Seeded: %j', results)
  //
  await db.disconnect()
}

main().catch(console.error)
