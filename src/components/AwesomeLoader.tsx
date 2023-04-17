import { Box, keyframes } from '@chakra-ui/react'
import React from 'react'

const AwesomeLoader = () => {
  const animationKeyframes = keyframes`
  0%    { transform: rotate(0deg)}
  100%  { transform: rotate(360deg)}
`
  const animation = `${animationKeyframes} 10s linear infinite`

  const color = 'brand.500'
  const bgColor = 'gray.200'

  return (
    <Box
      as="span"
      w="48px"
      h="48px"
      display="inline-block"
      position="relative"
      bg={bgColor}
      bgGradient={`radial(ellipse at center, ${color} 0%, ${color} 14%, ${bgColor} 15%, ${bgColor} 100%)`}
      bgSize="cover"
      bgPos="center"
      borderRadius="50%"
      _after={{
        content: '""',
        position: 'absolute',
        h: '16px',
        w: '4px',

        bg: color,
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) rotate(0deg)',
        transformOrigin: '25% 0',
        boxSizing: 'border-box',
        animation,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        h: '22px',
        w: '2px',
        bg: color,
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) rotate(0deg)',
        transformOrigin: '25% 0',
        boxSizing: 'border-box',
        animation,
        animationDuration: '1s',
      }}
    />
  )
}

export default AwesomeLoader
