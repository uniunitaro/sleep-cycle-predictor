'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC, memo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BsListUl } from 'react-icons/bs'
import { useAtom } from 'jotai'
import { useCalendarControl } from '../../hooks/useCalendarControl'
import { DisplayMode } from '../../types/chart'
import { useDisplayMode } from '../../hooks/useDisplayMode'
import { isRightColumnOpenAtom } from '../atoms/rightColumn'
import AddSleepButton from '../AddSleepButton'
import {
  Box,
  HStack,
  Heading,
  Icon,
  IconButton,
  Select,
  Show,
  Spacer,
  Tooltip,
} from '@/components/chakra'

const ChartHeader: FC<{
  targetDate: Date
  displayMode: DisplayMode
  isPublic: boolean
}> = memo(({ targetDate, displayMode, isPublic }) => {
  const { previousLink, nextLink } = useCalendarControl(targetDate, displayMode)

  const { currentDisplayMode, handleChange } = useDisplayMode(displayMode)
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e.target.value as DisplayMode)
  }

  const [isRightColumnOpen, setIsRightColumnOpen] = useAtom(
    isRightColumnOpenAtom
  )

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
        <HStack spacing="4">
          {!isPublic && (
            <Box
              w={isRightColumnOpen ? '0' : '168px'}
              visibility={isRightColumnOpen ? 'hidden' : 'visible'}
              opacity={isRightColumnOpen ? '0' : '1'}
              overflow="hidden"
              flexShrink="0"
              transition="all 0.3s"
            >
              <AddSleepButton />
            </Box>
          )}
          <Select value={currentDisplayMode} onChange={handleSelectChange}>
            <option value="month">月</option>
            <option value="week">週</option>
          </Select>
          <Tooltip
            label={isRightColumnOpen ? 'リストを非表示' : 'リストを表示'}
          >
            <IconButton
              icon={<Icon as={BsListUl} color="secondaryGray" boxSize="5" />}
              aria-label={
                isRightColumnOpen ? '睡眠リストを非表示' : '睡眠リストを表示'
              }
              variant="ghost"
              onClick={() => setIsRightColumnOpen(!isRightColumnOpen)}
            />
          </Tooltip>
        </HStack>
      </Show>
    </HStack>
  )
})

ChartHeader.displayName = 'ChartHeader'
export default ChartHeader
