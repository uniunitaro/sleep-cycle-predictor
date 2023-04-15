import { Card, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'

const AuthFormCard: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Card
      py={{ base: '0', md: '8' }}
      px={{ base: '4', md: '10' }}
      bg={{ base: 'transparent', md: useColorModeValue('white', 'gray.700') }}
      boxShadow="none"
      borderRadius={{ base: 'none', md: 'xl' }}
    >
      {children}
    </Card>
  )
}

export default AuthFormCard
