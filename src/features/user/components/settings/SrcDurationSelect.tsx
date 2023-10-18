'use client'

import { FC, useState, useTransition } from 'react'
import { RepeatClockIcon } from '@chakra-ui/icons'
import { SrcDuration } from '../../types/user'
import { updateConfig } from '../../repositories/users'
import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Select,
} from '@/components/chakra'
import { useErrorToast } from '@/hooks/useErrorToast'

const SrcDurationSelect: FC<{ srcDuration: SrcDuration }> = ({
  srcDuration,
}) => {
  const options: { value: SrcDuration; label: string }[] = [
    { value: 'week1', label: '直近1週間' },
    { value: 'week2', label: '直近2週間' },
    { value: 'month1', label: '直近1か月' },
    { value: 'month2', label: '直近2か月' },
    { value: 'month3', label: '直近3か月' },
    { value: 'month4', label: '直近4か月' },
    { value: 'month6', label: '直近6か月' },
    { value: 'year1', label: '直近1年' },
  ]

  const [selected, setSelected] = useState<SrcDuration>(srcDuration)
  const [, startTransition] = useTransition()
  const errorToast = useErrorToast()

  const handleChange = (selected: SrcDuration) => {
    setSelected(selected)
    startTransition(async () => {
      const { error } = await updateConfig({ predictionSrcDuration: selected })
      if (error) {
        errorToast()
      }
    })
  }

  return (
    <Flex>
      <FormControl>
        <FormLabel htmlFor="srcDuration">
          睡眠予測に使用する睡眠データの期間
        </FormLabel>
        <Select
          value={selected}
          id="srcDuration"
          onChange={(e) => handleChange(e.target.value as SrcDuration)}
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
        onClick={() => handleChange('month2')}
      />
    </Flex>
  )
}

export default SrcDurationSelect
