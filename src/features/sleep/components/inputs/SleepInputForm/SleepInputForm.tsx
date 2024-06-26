'use client'

import React, { FC, RefObject, createRef, useEffect, useRef } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  addDays,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isAfter,
  isEqual,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  subDays,
} from 'date-fns'
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Stack,
} from '@chakra-ui/react'
import DateAndTimeInput from '../DateAndTimeInput/DateAndTimeInput'

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
    const newStart = (() => {
      if (isAfter(start, new Date())) {
        const yesterday = subDays(new Date(), 1)
        return setYear(
          setMonth(setDate(start, getDate(yesterday)), getMonth(yesterday)),
          getYear(yesterday)
        )
      }
      return start
    })()

    const end = sleeps[index].end
    const newEnd = (() => {
      const startTimeOnly = setMinutes(
        setHours(new Date(), getHours(newStart)),
        getMinutes(newStart)
      )
      const endTimeOnly = setMinutes(
        setHours(new Date(), getHours(end)),
        getMinutes(end)
      )
      if (
        isEqual(startTimeOnly, endTimeOnly) ||
        isAfter(startTimeOnly, endTimeOnly)
      ) {
        // endがstartの翌日になる場合
        return setMinutes(
          setHours(addDays(newStart, 1), getHours(end)),
          getMinutes(end)
        )
      } else {
        // endがstartと同じ日になる場合
        return setMinutes(setHours(newStart, getHours(end)), getMinutes(end))
      }
    })()

    handleChange(index, { start: newStart, end: newEnd })
  }

  const handleChangeEnd = (index: number, end: Date) => {
    const newEnd = (() => {
      if (isAfter(end, new Date())) {
        const yesterday = subDays(new Date(), 1)
        return setYear(
          setMonth(setDate(end, getDate(yesterday)), getMonth(yesterday)),
          getYear(yesterday)
        )
      }
      return end
    })()

    const start = sleeps[index].start
    const newStart = (() => {
      const startTimeOnly = setMinutes(
        setHours(new Date(), getHours(start)),
        getMinutes(start)
      )
      const endTimeOnly = setMinutes(
        setHours(new Date(), getHours(newEnd)),
        getMinutes(newEnd)
      )
      if (
        isEqual(startTimeOnly, endTimeOnly) ||
        isAfter(startTimeOnly, endTimeOnly)
      ) {
        // endがstartの翌日になる場合
        return setMinutes(
          setHours(subDays(newEnd, 1), getHours(start)),
          getMinutes(start)
        )
      } else {
        // endがstartと同じ日になる場合
        return setMinutes(setHours(newEnd, getHours(start)), getMinutes(start))
      }
    })()

    handleChange(index, { start: newStart, end: newEnd })
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

  const sleepGroupRefs = useRef<RefObject<HTMLDivElement>[]>([])
  sleeps.forEach((_, index) => {
    sleepGroupRefs.current[index] = createRef()
  })

  useEffect(() => {
    sleepGroupRefs.current?.[sleeps.length - 1]?.current?.focus()
  }, [sleeps.length])

  return (
    <Stack spacing="5">
      <form>
        <Stack spacing="5">
          {sleeps.map((sleep, index) => (
            <Box
              ref={sleepGroupRefs.current[index]}
              key={sleep.id}
              role="group"
              tabIndex={-1}
            >
              {sleeps.length > 1 && (
                <Flex align="center" fontSize="sm" color="secondaryGray">
                  {`睡眠${index + 1}`}
                  <CloseButton ml="auto" onClick={() => removeSleep(index)} />
                </Flex>
              )}
              <Stack spacing="5">
                <FormControl>
                  <Box mb="2" fontSize="sm" id="sleep-start">
                    就寝日時
                  </Box>
                  <DateAndTimeInput
                    value={sleep.start}
                    labelText={
                      sleeps.length > 1
                        ? `睡眠${index + 1} 就寝日時`
                        : '就寝日時'
                    }
                    // FormControl以下は自動でidがつき、全てのfieldに同じidがついてしまうので空にする
                    id=""
                    onChange={(value) => handleChangeStart(index, value)}
                  />
                </FormControl>
                <FormControl>
                  <Box mb="2" fontSize="sm" id="sleep-end">
                    起床日時
                  </Box>
                  <DateAndTimeInput
                    value={sleep.end}
                    labelText={
                      sleeps.length > 1
                        ? `睡眠${index + 1} 起床日時`
                        : '起床日時'
                    }
                    id=""
                    onChange={(value) => handleChangeEnd(index, value)}
                  />
                </FormControl>
              </Stack>
            </Box>
          ))}
        </Stack>
      </form>
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
