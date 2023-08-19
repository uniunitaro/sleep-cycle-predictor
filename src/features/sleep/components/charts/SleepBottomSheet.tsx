'use client'
import { FC } from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import SleepOverview from '../Lists/SleepOverview'
import {} from '../atoms/globalModals'
import { Prediction, Sleep } from '../../types/sleep'
import { Box, Button, Divider } from '@/components/chakra'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetProps,
} from '@/components/BottomSheet/BottomSheet'

const SleepBottomSheet: FC<
  Omit<BottomSheetProps, 'children'> & {
    sleep?: Sleep
    prediction?: Prediction
    onClickEdit?: () => void
    onClickDelete?: () => void
  }
> = ({
  sleep,
  prediction,
  onClickEdit,
  onClickDelete,
  ...bottomSheetProps
}) => {
  return (
    <BottomSheet {...bottomSheetProps}>
      <BottomSheetBody px="0">
        <Box px="6" pb="4">
          {sleep && <SleepOverview sleep={sleep} />}
          {prediction && <SleepOverview prediction={prediction} />}
        </Box>
        {sleep && (
          <Box>
            <Divider opacity="1" />
            <Button
              w="full"
              h="14"
              px="6"
              variant="ghost"
              rounded="none"
              leftIcon={<EditIcon color="secondaryGray" />}
              iconSpacing="6"
              fontWeight="medium"
              justifyContent="left"
              onClick={onClickEdit}
            >
              睡眠記録を編集
            </Button>
            <Button
              w="full"
              h="14"
              px="6"
              variant="ghost"
              rounded="none"
              justifyContent="left"
              iconSpacing="6"
              fontWeight="medium"
              leftIcon={<DeleteIcon color="secondaryGray" />}
              onClick={onClickDelete}
            >
              睡眠記録を削除
            </Button>
          </Box>
        )}
      </BottomSheetBody>
    </BottomSheet>
  )
}

export default SleepBottomSheet
