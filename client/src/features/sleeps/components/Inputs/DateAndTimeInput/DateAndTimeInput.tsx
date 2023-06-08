import { FC, memo, useCallback, useState } from 'react'
import { getHours, getMinutes, setHours, setMinutes } from 'date-fns'
import { Box, HStack } from '@chakra-ui/react'
import TimeInput from '../TimeInput/TimeInput'
import DateInput from '../DateInput/DateInput'

const DateAndTimeInput: FC<{
  value: Date
  labelledBy?: string
  onChange: (value: Date) => void
}> = memo(({ value, labelledBy, onChange }) => {
  const [dateValue, setDateValue] = useState(value)
  const [timeValue, setTimeValue] = useState(value)

  const handleChangeDate = useCallback(
    (date: Date) => {
      setDateValue(date)

      const dateTimeValue = setHours(
        setMinutes(date, getMinutes(timeValue)),
        getHours(timeValue)
      )
      onChange(dateTimeValue)
    },
    [onChange, timeValue]
  )

  const handleChangeTime = useCallback(
    (time: Date) => {
      setTimeValue(time)

      const dateTimeValue = setHours(
        setMinutes(dateValue, getMinutes(time)),
        getHours(time)
      )
      onChange(dateTimeValue)
    },
    [onChange, dateValue]
  )

  return (
    <HStack w="100%">
      <Box flex="1">
        <DateInput
          value={dateValue}
          onChange={handleChangeDate}
          aria-labelledby={labelledBy}
        />
      </Box>
      <Box flex="1">
        <TimeInput
          value={timeValue}
          onChange={handleChangeTime}
          aria-labelledby={labelledBy}
        />
      </Box>
    </HStack>
  )
})

DateAndTimeInput.displayName = 'DateAndTimeInput'
export default DateAndTimeInput
