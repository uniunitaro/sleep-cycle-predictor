import { SrcDuration } from '@/features/user/constants/predictionSrcDurations'
import {
  defineConfigFactory,
  defineSleepFactory,
  defineUserFactory,
} from '@/src/__generated__/fabbrica'

export const UserFactory = defineUserFactory()

export const ConfigFactory = defineConfigFactory({
  defaultData: {
    user: UserFactory,
    predictionSrcDurationRelation: {
      create: { duration: 'month2' satisfies SrcDuration },
    },
  },
})

export const SleepFactory = defineSleepFactory({
  defaultData: {
    user: UserFactory,
  },
})
