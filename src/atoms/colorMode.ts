import { atomWithStorage } from 'jotai/utils'

export const useSystemColorModeAtom = atomWithStorage(
  'useSystemColorMode',
  true
)
