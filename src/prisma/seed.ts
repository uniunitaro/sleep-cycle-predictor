import { PREDICTION_SRC_DURATIONS } from '@/features/user/constants/predictionSrcDurations'
import { prisma } from '@/libs/prisma'

const main = async () => {
  prisma.$transaction(
    PREDICTION_SRC_DURATIONS.map((duration) =>
      prisma.predictionSrcDuration.upsert({
        where: { duration },
        create: { duration },
        update: { duration },
      })
    )
  )
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
