'use client'

import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PickerSelectionState } from '@mui/x-date-pickers/internals'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import HourMinuteInput from '../HourMinuteInput/HourMinuteInput'
import {
  Box,
  Center,
  HStack,
  Stack,
  useColorModeValue,
} from '@/components/chakra'

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
  const muiThemeColor = useColorModeValue('#38A169', '#9AE6B4')
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: muiThemeColor,
      },
    },
    typography: {
      fontFamily: 'var(--font-roboto), sans-serif',
    },
  })

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
        <ThemeProvider theme={muiTheme}>
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
        </ThemeProvider>
      </Stack>
    </Box>
  )
}

export default TimePicker
