'use client'

import { FC, useEffect, useState, useTransition } from 'react'
import { RepeatClockIcon } from '@chakra-ui/icons'
import { startOfMonth } from 'date-fns'
import { SrcDuration } from '../../types/user'
import { updateConfig } from '../../repositories/users'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Select,
  Stack,
} from '@/components/chakra'
import { useErrorToast } from '@/hooks/useErrorToast'
import DateInput from '@/features/sleep/components/inputs/DateInput/DateInput'

const SrcDurationSelect: FC<{
  srcDuration: SrcDuration
  srcStartDate?: Date
}> = ({ srcDuration, srcStartDate }) => {
  const options: { value: SrcDuration; label: string }[] = [
    { value: 'week1', label: '直近1週間' },
    { value: 'week2', label: '直近2週間' },
    { value: 'month1', label: '直近1か月' },
    { value: 'month2', label: '直近2か月' },
    { value: 'month3', label: '直近3か月' },
    { value: 'month4', label: '直近4か月' },
    { value: 'month6', label: '直近6か月' },
    { value: 'year1', label: '直近1年' },
    { value: 'custom', label: 'カスタム' },
  ]

  const [selected, setSelected] = useState<SrcDuration>(srcDuration)

  const [startDate, setStartDate] = useState<Date>(
    srcStartDate ?? startOfMonth(new Date())
  )

  useEffect(() => {
    // startOfMonthをサーバー側で実行するとタイムゾーンの問題があるためクライアント側で再度実行
    setStartDate(srcStartDate ?? startOfMonth(new Date()))
  }, [srcStartDate])

  const [, startTransition] = useTransition()
  const errorToast = useErrorToast()

  const handleChangeSelect = (selected: SrcDuration) => {
    setSelected(selected)
    startTransition(async () => {
      const { error } = await updateConfig({ predictionSrcDuration: selected })
      if (error) {
        errorToast()
      }
    })
  }

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date)
    startTransition(async () => {
      const { error } = await updateConfig({ predictionSrcStartDate: date })
      if (error) {
        errorToast()
      }
    })
  }

  return (
    <Stack spacing="3">
      <Flex>
        <FormControl>
          <FormLabel htmlFor="srcDuration">
            睡眠予測に使用する睡眠データの期間
          </FormLabel>
          <Select
            value={selected}
            id="srcDuration"
            onChange={(e) => handleChangeSelect(e.target.value as SrcDuration)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <IconButton
          icon={<Icon as={RepeatClockIcon} color="secondaryGray" boxSize="5" />}
          aria-label="睡眠予測に使用する睡眠データの期間をリセット"
          mt="29px"
          ml="4"
          variant="ghost"
          onClick={() => handleChangeSelect('month2')}
        />
      </Flex>
      {selected === 'custom' && (
        <Box>
          <FormControl>
            <FormLabel>睡眠予測に使用する睡眠データの開始日</FormLabel>
            <DateInput value={startDate} onChange={handleChangeStartDate} />
          </FormControl>
        </Box>
      )}
    </Stack>
  )
}

export default SrcDurationSelect
