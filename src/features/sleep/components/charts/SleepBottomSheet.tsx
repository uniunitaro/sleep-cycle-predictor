'use client'
import { FC } from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonProps, Divider } from '@chakra-ui/react'
import SleepOverview from '../Lists/SleepOverview'
import { Prediction, Sleep } from '../../types/sleep'
import { Drawer, DrawerBody, DrawerProps } from '@/components/Drawer/Drawer'

const SleepBottomSheet: FC<
  Omit<DrawerProps, 'children' | 'placement'> & {
    sleepOrPrediction: Sleep | Prediction | undefined
    onClickEdit?: () => void
    onClickDelete?: () => void
  }
> = ({ sleepOrPrediction, onClickEdit, onClickDelete, ...DrawerProps }) => {
  const sleep =
    sleepOrPrediction && 'sleeps' in sleepOrPrediction
      ? sleepOrPrediction
      : undefined
  const prediction = !(sleepOrPrediction && 'sleeps' in sleepOrPrediction)
    ? sleepOrPrediction
    : undefined

  return (
    <Drawer {...DrawerProps} placement="bottom">
      <DrawerBody px="0">
        <Box px="6" pb="4">
          {sleep && <SleepOverview sleep={sleep} />}
          {prediction && <SleepOverview prediction={prediction} />}
        </Box>
        {sleep && (
          <Box>
            <Divider opacity="1" />
            <BottomSheetButton
              leftIcon={<EditIcon color="secondaryGray" />}
              onClick={onClickEdit}
            >
              睡眠記録を編集
            </BottomSheetButton>
            <BottomSheetButton
              leftIcon={<DeleteIcon color="secondaryGray" />}
              onClick={onClickDelete}
            >
              睡眠記録を削除
            </BottomSheetButton>
          </Box>
        )}
      </DrawerBody>
    </Drawer>
  )
}

const BottomSheetButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      w="full"
      h="14"
      px="6"
      display="flex"
      variant="ghost"
      rounded="none"
      justifyContent="left"
      iconSpacing="6"
      fontWeight="medium"
      {...props}
    />
  )
}

export default SleepBottomSheet
