export const PREDICTION_SRC_DURATIONS = [
  'week1',
  'week2',
  'month1',
  'month2',
  'month3',
  'month4',
  'month6',
  'year1',
  'year10', // for testing only
  'custom',
] as const

export type SrcDuration = (typeof PREDICTION_SRC_DURATIONS)[number]
