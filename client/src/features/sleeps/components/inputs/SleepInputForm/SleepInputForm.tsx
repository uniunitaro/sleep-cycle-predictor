'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import DateAndTimeInput from '../DateAndTimeInput/DateAndTimeInput'
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Stack,
} from '@/components/chakra'

const SleepInputForm: FC<{
  sleeps: { start: Date; end: Date; id: number }[]
  onChange: (sleeps: { start: Date; end: Date; id: number }[]) => void
}> = ({ sleeps, onChange }) => {
  const handleChange = (index: number, sleep: { start: Date; end: Date }) => {
    const newSleeps = [...sleeps]
    newSleeps[index] = { ...sleeps[index], ...sleep }
    onChange(newSleeps)
  }

  const addSleep = () => {
    onChange([
      ...sleeps,
      {
        start: new Date(),
        end: new Date(),
        id: sleeps[sleeps.length - 1].id + 1,
      },
    ])
  }

  const removeSleep = (index: number) => {
    onChange(sleeps.filter((_, i) => i !== index))
  }

  return (
    <Stack spacing="5">
      <Stack spacing="5">
        {sleeps.map((sleep, index) => (
          // <Stack key={index} spacing="2">
          <Box key={sleep.id}>
            {sleeps.length > 1 && (
              <Flex align="center" fontSize="sm" color="secondaryGray">
                睡眠{index + 1}
                <CloseButton ml="auto" onClick={() => removeSleep(index)} />
              </Flex>
            )}
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="sleep-start">就寝日時</FormLabel>
                <DateAndTimeInput
                  value={sleep.start}
                  onChange={(value) =>
                    handleChange(index, { ...sleep, start: value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="sleep-end">起床日時</FormLabel>
                <DateAndTimeInput
                  value={sleep.end}
                  onChange={(value) =>
                    handleChange(index, { ...sleep, end: value })
                  }
                />
              </FormControl>
            </Stack>
          </Box>
          // </Stack>
        ))}
      </Stack>
      <Button
        leftIcon={<AddIcon />}
        variant="ghost"
        size="sm"
        fontWeight="normal"
        color="secondaryGray"
        onClick={addSleep}
      >
        分割睡眠を追加
      </Button>
    </Stack>
  )
}

export default SleepInputForm
