'use client'

import { FC, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Hide } from '@chakra-ui/react'
import SleepInputModal from './inputs/SleepInputModal/SleepInputModal'
import SleepDeleteModal from './SleepDeleteModal'
import SleepBottomSheet from './charts/SleepBottomSheet'
import {
  isDeleteModalOpenAtom,
  isInputModalOpenAtom,
  isSleepBottomSheetOpenAtom,
  selectedSleepOrPredictionAtom,
} from '@/features/sleep/atoms/globalModals'

const GlobalModals: FC = () => {
  const selectedSleepOrPrediction = useAtomValue(selectedSleepOrPredictionAtom)
  const selectedSleep =
    selectedSleepOrPrediction && 'sleeps' in selectedSleepOrPrediction
      ? selectedSleepOrPrediction
      : undefined

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

  const [isEditClicked, setIsEditClicked] = useState(false)
  const [isDeleteClicked, setIsDeleteClicked] = useState(false)

  const handleCloseComplete = () => {
    if (isEditClicked) {
      setIsInputModalOpen(true)
      setIsEditClicked(false)
    }
    if (isDeleteClicked) {
      setIsDeleteModalOpen(true)
      setIsDeleteClicked(false)
    }
  }

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
          sleepOrPrediction={selectedSleepOrPrediction}
          isOpen={isSleepBottomSheetOpen}
          onClose={onBottomSheetClose}
          onClickEdit={() => {
            setIsSleepBottomSheetOpen(false)
            setIsEditClicked(true)
          }}
          onClickDelete={() => {
            setIsSleepBottomSheetOpen(false)
            setIsDeleteClicked(true)
          }}
          onCloseComplete={handleCloseComplete}
        />
      </Hide>
    </>
  )
}

export default GlobalModals
