'use client'

import { Heading, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

const HeroHeading: FC = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, blue.500)',
    'linear(to-r, brand.400, blue.400)'
  )
  return (
    <Heading
      as="h1"
      size="2xl"
      wordBreak="keep-all"
      overflowWrap="anywhere"
      textAlign="center"
      bgGradient={bgGradient}
      bgClip="text"
    >
      日々ずれてゆく
      <wbr />
      睡眠サイクルを
      <wbr />
      予測
    </Heading>
  )
}

export default HeroHeading
