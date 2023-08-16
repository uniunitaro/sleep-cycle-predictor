import { GetSleepsResponse } from '@shared-types/sleeps/sleeps.type'

export const mockSleep = (
  modification?: Partial<GetSleepsResponse[number]>
): GetSleepsResponse[number] => ({
  id: 1,
  userId: '1',
  start: new Date(2023, 0, 1, 0),
  end: new Date(2023, 0, 1, 8),
  segmentedSleeps: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...modification,
})

export const mockSegmentedSleep = (
  modification?: Partial<GetSleepsResponse[number]['segmentedSleeps'][number]>
): GetSleepsResponse[number]['segmentedSleeps'][number] => ({
  id: 1,
  sleepId: 1,
  start: new Date(2023, 0, 1, 9),
  end: new Date(2023, 0, 1, 10),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...modification,
})
