import { atom } from 'jotai'
import { Prediction, Sleep } from '../../types/sleep'

export const isInputModalOpenAtom = atom(false)
export const isDeleteModalOpenAtom = atom(false)
export const isSleepBottomSheetOpenAtom = atom(false)
export const selectedSleepAtom = atom<Sleep | undefined>(undefined)
export const selectedPredictionAtom = atom<Prediction | undefined>(undefined)
