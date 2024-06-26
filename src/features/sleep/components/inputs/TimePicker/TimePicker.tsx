'use client'

import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import React, { FC, useEffect, useState } from 'react'
import { PickerSelectionState } from '@mui/x-date-pickers/internals'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { jaJP } from '@mui/x-date-pickers/locales'
import { Box, Center, HStack, Stack, useColorModeValue } from '@chakra-ui/react'
import HourMinuteInput from '../HourMinuteInput/HourMinuteInput'

const TimePicker: FC<{ value: Date; onChange: (value: Date) => void }> = ({
  value,
  onChange,
}) => {
  const hour = format(value, 'HH')
  const minute = format(value, 'mm')

  const [selectedField, setSelectedField] = useState<'hour' | 'minute'>('hour')

  const handleChangeTimeClock = (
    newValue: Date,
    selectionState?: PickerSelectionState
  ) => {
    if (selectedField === 'hour' && selectionState === 'partial') {
      setSelectedField('minute')
    }
    onChange(newValue)
  }

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
  const muiTheme = createTheme(
    {
      palette: {
        primary: {
          main: muiThemeColor,
        },
      },
      typography: {
        fontFamily: 'var(--font-roboto), sans-serif',
      },
    },
    jaJP
  )

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
            <Box
              tabIndex={-1}
              aria-hidden
              onClick={() => setSelectedField('hour')}
            >
              <HourMinuteInput
                value={hour}
                isSelected={selectedField === 'hour'}
                isReadOnly
                id=""
                tabIndex={-1}
                aria-hidden
              />
            </Box>
            <Center width="4" fontSize="2xl" fontWeight="bold" aria-hidden>
              :
            </Center>
            <Box
              tabIndex={-1}
              aria-hidden
              onClick={() => setSelectedField('minute')}
            >
              <HourMinuteInput
                value={minute}
                isSelected={selectedField === 'minute'}
                isReadOnly
                id=""
                tabIndex={-1}
                aria-hidden
              />
            </Box>
          </HStack>
        </Center>
        <ThemeProvider theme={muiTheme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box aria-hidden>
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
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </Stack>
    </Box>
  )
}

export default TimePicker
