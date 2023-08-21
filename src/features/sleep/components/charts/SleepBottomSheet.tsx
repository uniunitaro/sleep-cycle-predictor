'use client'
import { FC } from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import SleepOverview from '../Lists/SleepOverview'
import {} from '../atoms/globalModals'
import { Prediction, Sleep } from '../../types/sleep'
import { Box, Button, ButtonProps, Divider } from '@/components/chakra'
import { Drawer, DrawerBody, DrawerProps } from '@/components/Drawer/Drawer'

const SleepBottomSheet: FC<
  Omit<DrawerProps, 'children' | 'placement'> & {
    sleep?: Sleep
    prediction?: Prediction
    onClickEdit?: () => void
    onClickDelete?: () => void
  }
> = ({ sleep, prediction, onClickEdit, onClickDelete, ...DrawerProps }) => {
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
