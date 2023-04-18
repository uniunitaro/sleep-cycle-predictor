import { Box, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

const Logo = () => {
  const { colorMode } = useColorMode()

  return (
    <Box w="160px" h="23px" position="relative">
      {colorMode === 'light' ? (
        <Image
          src="/logo-light.png"
          alt="Sleep Predictor"
          fill
          style={{ objectFit: 'contain' }}
        />
      ) : (
        <Image
          src="/logo-dark.png"
          alt="Sleep Predictor"
          fill
          style={{ objectFit: 'contain' }}
        />
      )}
    </Box>
  )
}

export default Logo
