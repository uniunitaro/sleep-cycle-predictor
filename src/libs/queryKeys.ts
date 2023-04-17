import { mergeQueryKeys } from '@lukemorales/query-key-factory'
import { predictionKeys } from '@/features/sleeps/apis/usePredictions'
import { sleepKeys } from '@/features/sleeps/apis/useSleeps'

export const queries = mergeQueryKeys(sleepKeys, predictionKeys)
