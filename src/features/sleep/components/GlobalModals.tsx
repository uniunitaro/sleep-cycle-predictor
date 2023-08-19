'use client'

import { FC } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Hide } from '@chakra-ui/react'
import SleepInputModal from './inputs/SleepInputModal/SleepInputModal'
import SleepDeleteModal from './SleepDeleteModal'
import {
  isDeleteModalOpenAtom,
  isInputModalOpenAtom,
  isSleepBottomSheetOpenAtom,
  selectedPredictionAtom,
  selectedSleepAtom,
} from './atoms/globalModals'
import SleepBottomSheet from './charts/SleepBottomSheet'

const GlobalModals: FC = () => {
  const selectedSleep = useAtomValue(selectedSleepAtom)
  const selectedPrediction = useAtomValue(selectedPredictionAtom)

  const [isInputModalOpen, setIsInputModalOpen] = useAtom(isInputModalOpenAtom)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useAtom(
    isDeleteModalOpenAtom
  )
  const [isSleepBottomSheetOpen, setIsSleepBottomSheetOpen] = useAtom(
    isSleepBottomSheetOpenAtom
  )

  const onEditClose = () => setIsInputModalOpen(false)
  const onDeleteClose = () => setIsDeleteModalOpen(false)
  const onBottomSheetClose = () => setIsSleepBottomSheetOpen(false)

  return (
    <>
      <SleepInputModal
        isOpen={isInputModalOpen}
        onClose={onEditClose}
        originalSleep={selectedSleep}
      />
      {selectedSleep && (
        <SleepDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={onDeleteClose}
          sleep={selectedSleep}
        />
      )}
      <Hide above="md">
        <SleepBottomSheet
          sleep={selectedSleep}
          prediction={selectedPrediction}
          isOpen={isSleepBottomSheetOpen}
          onClose={onBottomSheetClose}
          onClickEdit={() => {
            setIsSleepBottomSheetOpen(false)
            setIsInputModalOpen(true)
          }}
          onClickDelete={() => {
            setIsSleepBottomSheetOpen(false)
            setIsDeleteModalOpen(true)
          }}
        />
      </Hide>
    </>
  )
}

export default GlobalModals
