import { atom } from 'jotai'
import { BeforeInstallPromptEvent } from '@/types/beforeInstallPromptEvent'

export const installPromptAtom = atom<BeforeInstallPromptEvent | undefined>(
  undefined
)
