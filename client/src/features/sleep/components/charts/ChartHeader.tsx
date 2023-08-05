'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useCalendarControlLinks } from '../../hooks/useCalendarControlLinks'
import { HStack, Heading, Icon, IconButton } from '@/components/chakra'

const ChartHeader: FC<{ targetDate: Date }> = ({ targetDate }) => {
  const { previousLink, nextLink } = useCalendarControlLinks(targetDate)

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
}

export default ChartHeader
