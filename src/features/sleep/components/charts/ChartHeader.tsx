'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC, memo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useCalendarControl } from '../../hooks/useCalendarControl'
import { DisplayMode } from '../../types/chart'
import { useDisplayMode } from '../../hooks/useDisplayMode'
import {
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Select,
  Show,
  Spacer,
} from '@/components/chakra'

const ChartHeader: FC<{ targetDate: Date; displayMode: DisplayMode }> = memo(
  ({ targetDate, displayMode }) => {
    const { previousLink, nextLink } = useCalendarControl(
      targetDate,
      displayMode
    )

    const { currentDisplayMode, handleChange } = useDisplayMode(displayMode)
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange(e.target.value as DisplayMode)
    }

    return (
      <HStack>
        <IconButton
          as={Link}
          href={previousLink}
          icon={<Icon as={FaChevronLeft} color="secondaryGray" />}
          aria-label="前の月を表示"
          size="sm"
          variant="ghost"
        />
        <Heading size="md" fontWeight="normal">
          {format(targetDate, 'yyyy年M月')}
        </Heading>
        <IconButton
          as={Link}
          href={nextLink}
          icon={<Icon as={FaChevronRight} color="secondaryGray" />}
          aria-label="次の月を表示"
          size="sm"
          variant="ghost"
        />
        <Show above="md">
          <Spacer />
          <Flex>
            <Select value={currentDisplayMode} onChange={handleSelectChange}>
              <option value="month">月</option>
              <option value="week">週</option>
            </Select>
          </Flex>
        </Show>
      </HStack>
    )
  }
)

ChartHeader.displayName = 'ChartHeader'
export default ChartHeader
