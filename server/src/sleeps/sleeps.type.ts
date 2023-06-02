import { SegmentedSleep, Sleep } from '@prisma/client'

export type GetSleepsResponse = (Sleep & {
  segmentedSleeps: SegmentedSleep[]
})[]

export type CreateSleepResponse = Sleep & { segmentedSleeps: SegmentedSleep[] }
export type UpdateSleepResponse = Sleep & { segmentedSleeps: SegmentedSleep[] }
