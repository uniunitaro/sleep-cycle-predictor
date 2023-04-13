import { Box, Center, HStack, Stack, useColorModeValue } from '@chakra-ui/react'
import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PickerSelectionState } from '@mui/x-date-pickers/internals'
import HourMinuteInput from './HourMinuteInput'

type Schema = {
  hour: string
  minute: string
}

const TimePicker: FC<{ value: Date; onChange: (value: Date) => void }> = ({
  value,
  onChange,
}) => {
  const { register, setValue } = useForm<Schema>()

  const [selectedField, setSelectedField] = useState<'hour' | 'minute'>('hour')

  // TODO キーボード入力版も作る
  // const handleChangeHour = (hour: string) => {
  //   const newValue = setHours(value, Number(hour))
  //   onChange(newValue)
  // }

  // const handleChangeMinute = (minute: string) => {
  //   const newValue = setMinutes(value, Number(minute))
  //   onChange(newValue)
  // }

  const handleChangeTimeClock = (
    newValue: Date,
    selectionState?: PickerSelectionState
  ) => {
    if (selectedField === 'hour' && selectionState === 'partial') {
      setSelectedField('minute')
    }
    onChange(newValue)
  }

  useEffect(() => {
    setValue('hour', format(value, 'HH'))
    setValue('minute', format(value, 'mm'))
  }, [value, setValue])

  // モーダル表示時のタップでTimeClockが反応するのを防ぐ
  const [isTouched, setIsTouched] = useState(false)
  useEffect(() => {
    const listener = () => setIsTouched(true)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('touchstart', listener)
    }
  }, [])

  return (
    <Box
      sx={{
        '.MuiClockNumber-root': {
          color: 'chakra-body-text',
          '&.Mui-selected': {
            color: useColorModeValue('whiteAlpha.900', 'gray.800'),
          },
        },
        '.MuiClock-root': {
          margin: 0,
        },
        '.MuiTimeClock-root': {
          width: 'auto',
        },
        '.MuiClock-clock': {
          backgroundColor: useColorModeValue(
            'blackAlpha.100',
            'whiteAlpha.100'
          ),
        },
      }}
    >
      <Stack spacing="6">
        <Center>
          <HStack spacing="0">
            <Box onClick={() => setSelectedField('hour')}>
              <HourMinuteInput
                isSelected={selectedField === 'hour'}
                isReadOnly
                {...register('hour')}
              />
            </Box>
            <Center width="4" fontSize="2xl" fontWeight="bold">
              :
            </Center>
            <Box onClick={() => setSelectedField('minute')}>
              <HourMinuteInput
                isSelected={selectedField === 'minute'}
                isReadOnly
                {...register('minute')}
              />
            </Box>
          </HStack>
        </Center>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimeClock
            value={value}
            sx={{ mx: '-10px' }}
            ampm={false}
            view={selectedField === 'hour' ? 'hours' : 'minutes'}
            readOnly={!isTouched}
            onChange={(newValue, selectionState) =>
              newValue && handleChangeTimeClock(newValue, selectionState)
            }
          />
        </LocalizationProvider>
      </Stack>
    </Box>
  )
}

export default TimePicker
