import {
  defineConfigFactory,
  defineSegmentedSleepFactory,
  defineSleepFactory,
  defineUserFactory,
} from 'src/__generated__/fabbrica'

export const UserFactory = defineUserFactory()

export const SleepFactory = defineSleepFactory({
  defaultData: { user: UserFactory },
})

export const SegmentedSleepFactory = defineSegmentedSleepFactory({
  defaultData: { sleep: SleepFactory },
})

export const ConfigFactory = defineConfigFactory({
  defaultData: { user: UserFactory },
})
