'use client'

import Image from 'next/image'
import { FC } from 'react'
import { Box, useColorMode } from '../chakra'
import logoLight from '@/assets/logo-light.png'
import logoDark from '@/assets/logo-dark.png'

const Logo: FC = () => {
  const { colorMode } = useColorMode()

  return (
    <Box w="160px" h="23px" position="relative">
      {colorMode === 'light' ? (
        <Image
          src={logoLight}
          alt="Sleep Predictor"
          fill
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <Image
          src={logoDark}
          alt="Sleep Predictor"
          fill
          style={{ objectFit: 'contain' }}
        />
      )}
    </Box>
  )
}

export default Logo
