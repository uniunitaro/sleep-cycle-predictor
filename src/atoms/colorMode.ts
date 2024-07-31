import { atomWithStorage } from 'jotai/utils'
import { LOCAL_STORAGE_USE_SYSTEM_KEY } from '@/libs/chakraStorageManager'

export const useSystemColorModeAtom = atomWithStorage(
  LOCAL_STORAGE_USE_SYSTEM_KEY,
  true
)
