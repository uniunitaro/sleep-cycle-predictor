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
  BoxProps,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'

export type SleepOverviewRef = {
  modalRef: RefObject<HTMLDivElement>
}

const SleepOverview = forwardRef<
  SleepOverviewRef,
  (
    | {
        sleep: Sleep
        prediction?: undefined
        variant?: 'default' | 'withMenu'
      }
    | {
        sleep?: undefined
        prediction: Prediction
        variant?: undefined
      }
  ) &
    BoxProps
>(({ sleep, prediction, variant = 'default', ...rest }, ref) => {
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
    return format(date, 'E', { locale: ja })
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
    <HStack
      minH="0"
      align="normal"
      gap="2"
      // aria-label={sleep ? '過去の睡眠' : '予測された睡眠'}
      {...rest}
    >
      <Box bgColor={sleep ? 'chartBrand' : 'chartBlue'} w="1" rounded="full" />
      <Box flex="1" sx={{ fontVariantNumeric: 'tabular-nums' }} aria-hidden>
        <Flex align="center">
          <Box as="span" fontSize="sm" color={displayDateStart.color}>
            {displayDateStart.date}
          </Box>
          <Box as="span" fontSize="xs" ml="1" color={displayDateStart.color}>
            {`(${displayDateStart.day})`}
          </Box>
          {displayDateEnd && (
            <>
              <Box as="span" mx="1" fontSize="xs">
                ～
              </Box>
              <Box as="span" fontSize="sm" color={displayDateEnd.color}>
                {displayDateEnd.date}
              </Box>
              <Box as="span" fontSize="xs" ml="1" color={displayDateEnd.color}>
                {`(${displayDateEnd.day})`}
              </Box>
            </>
          )}
        </Flex>
        {sleeps.map((s) => (
          <Flex align="center" key={s.start.getTime()}>
            <Box as="span" fontWeight="semibold" fontSize="lg">
              {format(s.start, 'HH:mm', { locale: ja })}
            </Box>
            <Box as="span" ml="1">
              ～
            </Box>
            <Box as="span" ml="1" fontWeight="semibold" fontSize="lg">
              {format(s.end, 'HH:mm', { locale: ja })}
            </Box>
            {sleep && (
              <Box as="span" ml="auto" pl="3" fontSize="sm">
                {`${differenceInHours(s.end, s.start)}時間${(
                  differenceInMinutes(s.end, s.start) % 60
                )
                  .toString()
                  .padStart(2, '0')}分`}
              </Box>
            )}
          </Flex>
        ))}
      </Box>
      <Box srOnly>
        {(sleep ? '過去の睡眠、' : '予測された睡眠、') +
          `${displayDateStart.date}${displayDateStart.day}曜日` +
          (displayDateEnd
            ? `から${displayDateEnd.date}${displayDateEnd.day}曜日、`
            : '、') +
          sleeps
            .map(
              (s) =>
                `${format(s.start, 'H時m分')}から${format(s.end, 'H時m分')}、` +
                (sleep
                  ? `睡眠の長さ、${differenceInHours(s.end, s.start)}時間${
                      differenceInMinutes(s.end, s.start) % 60
                    }分`
                  : '')
            )
            .join('、')}
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
              aria-label="詳細"
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
