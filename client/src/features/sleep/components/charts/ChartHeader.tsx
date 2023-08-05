'use client'

import { format, subMonths, addMonths, startOfMonth } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { usePathname, useSearchParams } from 'next/navigation'
import { HStack, Heading, Icon, IconButton } from '@/components/chakra'

const ChartHeader: FC<{ targetDate: Date }> = ({ targetDate }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const leftButtonDate = format(
    startOfMonth(subMonths(targetDate, 1)),
    'yyyy-MM-dd'
  )
  const leftButtonSearchParams = new URLSearchParams([
    ...Array.from(searchParams.entries()).filter(([key]) => key !== 'date'),
    ['date', leftButtonDate],
  ])

  const rightButtonDate = format(
    startOfMonth(addMonths(targetDate, 1)),
    'yyyy-MM-dd'
  )
  const rightButtonSearchParams = new URLSearchParams([
    ...Array.from(searchParams.entries()).filter(([key]) => key !== 'date'),
    ['date', rightButtonDate],
  ])

  return (
    <HStack px={{ base: 4, md: 0 }}>
      <IconButton
        as={Link}
        href={`${pathname}?${leftButtonSearchParams.toString()}`}
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
        href={`${pathname}?${rightButtonSearchParams.toString()}`}
        icon={<Icon as={FaChevronRight} color="secondaryGray" />}
        aria-label="次の月を表示"
        size="sm"
        variant="ghost"
      />
    </HStack>
  )
}

export default ChartHeader
