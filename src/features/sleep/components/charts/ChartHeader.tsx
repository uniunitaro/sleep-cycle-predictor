'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { FC, memo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BsListUl } from 'react-icons/bs'
import { useAtom, useSetAtom } from 'jotai'
import { MdShare } from 'react-icons/md'
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  Select,
  Show,
  Spacer,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useCalendarControl } from '../../hooks/useCalendarControl'
import { DisplayMode } from '../../types/chart'
import { useDisplayMode } from '../../hooks/useDisplayMode'
import AddSleepButton from '../AddSleepButton'
import ShareModal from '../ShareModal'
import { isRightColumnOpenAtom } from '@/features/sleep/atoms/rightColumn'
import { isInputModalOpenAtom } from '@/features/sleep/atoms/globalModals'

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

  const setIsInputModalOpen = useSetAtom(isInputModalOpenAtom)

  const isBelowLg = useBreakpointValue({ base: true, lg: false })

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <HStack zIndex="0" spacing="0">
      <HStack flexShrink="0">
        <IconButton
          as={Link}
          href={previousLink}
          icon={<Icon as={FaChevronLeft} color="secondaryGray" />}
          aria-label={displayMode === 'week' ? '前の週を表示' : '前の月を表示'}
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
          aria-label={displayMode === 'week' ? '次の週を表示' : '次の月を表示'}
          size="sm"
          variant="ghost"
        />
      </HStack>
      <Spacer />
      <HStack spacing="4" pos="relative" zIndex="0">
        <Show above="md">
          {!isPublic && (
            <Box
              w={isRightColumnOpen ? '0' : '168px'}
              visibility={isRightColumnOpen ? 'hidden' : 'visible'}
              opacity={isRightColumnOpen ? '0' : '1'}
              flexShrink="0"
              transition="all 0.3s"
            >
              <AddSleepButton onClick={() => setIsInputModalOpen(true)} />
            </Box>
          )}
        </Show>
        <HStack spacing="4" bgColor="contentBg" zIndex="1">
          {!isPublic && !(isRightColumnOpen && isBelowLg) && (
            <>
              <Button
                colorScheme="brand"
                leftIcon={<Icon as={MdShare} boxSize={{ base: 4, md: 5 }} />}
                size={{ base: 'sm', md: 'md' }}
                onClick={onOpen}
              >
                共有<Show above="md">する</Show>
              </Button>
              <ShareModal isOpen={isOpen} onClose={onClose} />
            </>
          )}
          <Show above="md">
            <Select
              value={currentDisplayMode}
              onChange={handleSelectChange}
              aria-label="表示形式の切り替え"
              flex="1"
            >
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
          </Show>
        </HStack>
      </HStack>
    </HStack>
  )
})

ChartHeader.displayName = 'ChartHeader'
export default ChartHeader
