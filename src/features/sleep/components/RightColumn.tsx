'use client'

import { FC } from 'react'
import SleepList from './Lists/SleepList'
import SleepInputModal from './inputs/SleepInputModal/SleepInputModal'
import AddSleepButton from './AddSleepButton'
import { Card, CardBody, useDisclosure } from '@/components/chakra'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  isPublic: boolean
}
const RightColumn: FC<Props> = ({
  sleeps,
  predictions,
  targetDate,
  isPublic,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Card overflowY="hidden" h="full">
      {!isPublic && (
        <CardBody flexGrow="0">
          <AddSleepButton w="full" onClick={onOpen} />
          <SleepInputModal isOpen={isOpen} onClose={onClose} />
        </CardBody>
      )}
      <CardBody overflowY="auto">
        <SleepList
          sleeps={sleeps}
          predictions={predictions}
          targetDate={targetDate}
          variant="desktop"
        />
      </CardBody>
    </Card>
  )
}

export default RightColumn
