import { mergeQueryKeys } from '@lukemorales/query-key-factory'
import { predictionKeys } from '@/features/sleep/apis/usePredictions'
import { sleepKeys } from '@/features/sleep/apis/useSleeps'

export const queries = mergeQueryKeys(sleepKeys, predictionKeys)
