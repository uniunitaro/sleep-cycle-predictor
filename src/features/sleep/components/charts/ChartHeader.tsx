'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC, memo, useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useCalendarControl } from '../../hooks/useCalendarControl'
import { DisplayMode } from '../../types/chart'
import {
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Select,
  Spacer,
} from '@/components/chakra'
import { useHandleSearchParams } from '@/hooks/useHandleSearchParams'

const ChartHeader: FC<{ targetDate: Date; displayMode: DisplayMode }> = memo(
  ({ targetDate, displayMode }) => {
    const { previousLink, nextLink } = useCalendarControl(
      targetDate,
      displayMode
    )

    const router = useRouter()
    const [currentView, setCurrentView] = useState(displayMode)
    useEffect(() => {
      setCurrentView(displayMode)
    }, [displayMode])

    const { addSearchParamsWithCurrentPathname } = useHandleSearchParams()
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentView(e.target.value as DisplayMode)
      router.push(addSearchParamsWithCurrentPathname('view', e.target.value))
    }

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
        <Spacer />
        <Flex>
          <Select value={currentView} onChange={handleSelectChange}>
            <option value="month">月</option>
            <option value="week">週</option>
          </Select>
        </Flex>
      </HStack>
    )
  }
)

ChartHeader.displayName = 'ChartHeader'
export default ChartHeader
