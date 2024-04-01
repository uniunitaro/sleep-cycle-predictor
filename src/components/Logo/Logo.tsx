'use client'

import Image from 'next/image'
import { FC } from 'react'
import { useColorMode } from '@chakra-ui/react'
import logoLight from '@/assets/logo-light.png'
import logoDark from '@/assets/logo-dark.png'

const Logo: FC = () => {
  const { colorMode } = useColorMode()

  return colorMode === 'light' ? (
    <Image
      src={logoLight}
      alt="Sleep Predictor"
      width={160}
      style={{ objectFit: 'contain' }}
    />
  ) : (
    <Image
      src={logoDark}
      alt="Sleep Predictor"
      width={160}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default Logo
