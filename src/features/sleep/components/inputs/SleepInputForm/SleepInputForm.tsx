'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  addDays,
  getHours,
  getMinutes,
  isAfter,
  setHours,
  setMinutes,
  subDays,
} from 'date-fns'
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

  const handleChangeStart = (index: number, start: Date) => {
    const end = sleeps[index].end
    const newEnd = (() => {
      const startTimeOnly = setMinutes(
        setHours(new Date(), getHours(start)),
        getMinutes(start)
      )
      const endTimeOnly = setMinutes(
        setHours(new Date(), getHours(end)),
        getMinutes(end)
      )
      if (isAfter(startTimeOnly, endTimeOnly)) {
        // endがstartの翌日になる場合
        return setMinutes(
          setHours(addDays(start, 1), getHours(end)),
          getMinutes(end)
        )
      } else {
        // endがstartと同じ日になる場合
        return setMinutes(setHours(start, getHours(end)), getMinutes(end))
      }
    })()

    handleChange(index, { start, end: newEnd })
  }

  const handleChangeEnd = (index: number, end: Date) => {
    const start = sleeps[index].start
    const newStart = (() => {
      const startTimeOnly = setMinutes(
        setHours(new Date(), getHours(start)),
        getMinutes(start)
      )
      const endTimeOnly = setMinutes(
        setHours(new Date(), getHours(end)),
        getMinutes(end)
      )
      if (isAfter(startTimeOnly, endTimeOnly)) {
        // endがstartの翌日になる場合
        return setMinutes(
          setHours(subDays(end, 1), getHours(start)),
          getMinutes(start)
        )
      } else {
        // endがstartと同じ日になる場合
        return setMinutes(setHours(end, getHours(start)), getMinutes(start))
      }
    })()

    handleChange(index, { start: newStart, end })
  }

  const addSleep = () => {
    const lastSleep = sleeps[sleeps.length - 1]
    onChange([
      ...sleeps,
      {
        start: lastSleep.end,
        end: lastSleep.end,
        id: lastSleep.id + 1,
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
                  onChange={(value) => handleChangeStart(index, value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="sleep-end">起床日時</FormLabel>
                <DateAndTimeInput
                  value={sleep.end}
                  onChange={(value) => handleChangeEnd(index, value)}
                />
              </FormControl>
            </Stack>
          </Box>
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
