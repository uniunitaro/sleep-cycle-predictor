'use client'

import { RefObject, forwardRef, useImperativeHandle, useRef } from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  format,
  getDate,
  differenceInHours,
  differenceInMinutes,
  getDay,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Sleep, Prediction } from '../../types/sleep'
import SleepInputModal from '../inputs/SleepInputModal/SleepInputModal'
import SleepDeleteModal from '../SleepDeleteModal'
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@/components/chakra'

export type SleepOverviewRef = {
  modalRef: RefObject<HTMLDivElement>
}

const SleepOverview = forwardRef<
  SleepOverviewRef,
  | { sleep: Sleep; prediction?: undefined; variant?: 'default' | 'withMenu' }
  | { sleep?: undefined; prediction: Prediction; variant?: undefined }
>(({ sleep, prediction, variant = 'default' }, ref) => {
  const firstSleep = sleep ? sleep?.sleeps[0] : prediction
  const sleeps = sleep ? sleep?.sleeps : [prediction]

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const modalRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(
    ref,
    () =>
      ({
        modalRef,
      } satisfies SleepOverviewRef)
  )

  const formatDate = (date: Date) => {
    return format(date, getDate(date) === 1 ? 'M月d日' : 'd日', {
      locale: ja,
    })
  }
  const formatDay = (date: Date) => {
    return format(date, '（E）', { locale: ja })
  }

  const lastSleep = sleeps[sleeps.length - 1]
  const displayDateStart = {
    date: formatDate(firstSleep.start),
    day: formatDay(firstSleep.start),
    color:
      getDay(firstSleep.start) === 0
        ? 'dayRed'
        : getDay(firstSleep.start) === 6
        ? 'dayBlue'
        : undefined,
  }
  const displayDateEnd =
    formatDate(firstSleep.start) !== formatDate(lastSleep.end)
      ? {
          date: formatDate(lastSleep.end),
          day: formatDay(lastSleep.end),
          color:
            getDay(lastSleep.end) === 0
              ? 'dayRed'
              : getDay(lastSleep.end) === 6
              ? 'dayBlue'
              : undefined,
        }
      : undefined

  return (
    <HStack minH="0" align="normal" gap="2">
      <Box bgColor={sleep ? 'chartBrand' : 'chartBlue'} w="1" rounded="full" />
      <Box flex="1" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        <Flex align="center">
          <Box fontSize="sm" color={displayDateStart.color}>
            {displayDateStart.date}
          </Box>
          <Box fontSize="xs" color={displayDateStart.color}>
            {displayDateStart.day}
          </Box>
          {displayDateEnd && (
            <>
              <Box mr="1" fontSize="sm">
                ～
              </Box>
              <Box fontSize="sm" color={displayDateEnd.color}>
                {displayDateEnd.date}
              </Box>
              <Box fontSize="xs" color={displayDateEnd.color}>
                {displayDateEnd.day}
              </Box>
            </>
          )}
        </Flex>
        {sleeps.map((s) => (
          <Flex align="center" key={s.start.getTime()}>
            <Box fontWeight="semibold" fontSize="lg">
              {format(s.start, 'HH:mm', { locale: ja })}
            </Box>
            <Box ml="1">～</Box>
            <Box ml="1" fontWeight="semibold" fontSize="lg">
              {format(s.end, 'HH:mm', { locale: ja })}
            </Box>
            {sleep && (
              <Box ml="auto" pl="3" fontSize="sm">
                {differenceInHours(s.end, s.start)}時間
                {(differenceInMinutes(s.end, s.start) % 60)
                  .toString()
                  .padStart(2, '0')}
                分
              </Box>
            )}
          </Flex>
        ))}
      </Box>
      {sleep && variant === 'withMenu' && (
        <Flex align="center">
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon as={BsThreeDotsVertical} />}
              variant="ghost"
              size="sm"
              color="secondaryGray"
            />
            <MenuList>
              <MenuItem
                icon={<EditIcon color="secondaryGray" />}
                onClick={onEditOpen}
              >
                睡眠記録を編集
              </MenuItem>
              <MenuItem
                icon={<DeleteIcon color="secondaryGray" />}
                onClick={onDeleteOpen}
              >
                睡眠記録を削除
              </MenuItem>
            </MenuList>
          </Menu>
          <SleepInputModal
            ref={modalRef}
            isOpen={isEditOpen}
            onClose={onEditClose}
            originalSleep={sleep}
          />
          <SleepDeleteModal
            ref={modalRef}
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            sleep={sleep}
          />
        </Flex>
      )}
    </HStack>
  )
})

SleepOverview.displayName = 'SleepOverview'

export default SleepOverview
