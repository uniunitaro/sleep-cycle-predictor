'use client'

import { FC } from 'react'
import { RiRhythmFill } from 'react-icons/ri'
import { MdShare } from 'react-icons/md'
import { Box, Grid, HStack, Icon, Stack, Text } from '@/components/chakra'

const Features: FC = () => {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="8">
      <HStack spacing="4" align="start">
        <Grid
          bgColor="buttonBrand"
          rounded="md"
          w="12"
          h="12"
          placeItems="center"
          flexShrink="0"
        >
          <Icon as={RiRhythmFill} color="globalBg" boxSize="7" />
        </Grid>
        <Box>
          <Stack>
            <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
              睡眠サイクルを予測
            </Text>
            <Text color="secondaryGray">
              日々の睡眠を記録すると、未来の睡眠サイクルを統計的に予測します。
              <br />
              世界の昼夜とあなたの昼夜をグラフィカルに可視化します。
              <br />
            </Text>
          </Stack>
        </Box>
      </HStack>
      <HStack spacing="4" align="start">
        <Grid
          bgColor="buttonBrand"
          rounded="md"
          w="12"
          h="12"
          placeItems="center"
          flexShrink="0"
        >
          <Icon as={MdShare} color="globalBg" boxSize="7" />
        </Grid>
        <Box>
          <Stack>
            <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
              睡眠予測を共有
            </Text>
            <Text color="secondaryGray">
              予測された睡眠サイクルを共有して、スケジュール調整をスムーズに。
              <br />
              あなたの睡眠サイクルを知ってもらいましょう。
            </Text>
          </Stack>
        </Box>
      </HStack>
    </Grid>
  )
}

export default Features
