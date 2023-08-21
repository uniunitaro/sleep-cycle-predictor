'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import SleepList from './Lists/SleepList'
import SleepInputModal from './inputs/SleepInputModal/SleepInputModal'
import { Button, Card, CardBody, useDisclosure } from '@/components/chakra'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
}
const RightColumn: FC<Props> = ({ sleeps, predictions, targetDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Card overflow="auto">
      <CardBody flexGrow="0">
        <Button
          leftIcon={<AddIcon />}
          colorScheme="green"
          w="full"
          variant="shadow"
          onClick={onOpen}
        >
          睡眠記録を追加
        </Button>
        <SleepInputModal isOpen={isOpen} onClose={onClose} />
      </CardBody>
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
