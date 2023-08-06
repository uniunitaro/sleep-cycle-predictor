'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC, memo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useCalendarControl } from '../../hooks/useCalendarControl'
import { HStack, Heading, Icon, IconButton } from '@/components/chakra'

const ChartHeader: FC<{ targetDate: Date }> = memo(({ targetDate }) => {
  const { previousLink, nextLink } = useCalendarControl(targetDate)

  return (
    <HStack px={{ base: 4, md: 0 }}>
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
    </HStack>
  )
})

ChartHeader.displayName = 'ChartHeader'
export default ChartHeader
