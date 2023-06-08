import { Card } from '@chakra-ui/react'
import React, { FC } from 'react'

const AuthFormCard: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Card
      py={{ base: '0', md: '8' }}
      px={{ base: '4', md: '10' }}
      bg={{ base: 'transparent', md: 'contentBg' }}
      boxShadow="none"
      borderRadius={{ base: 'none', md: 'xl' }}
    >
      {children}
    </Card>
  )
}

export default AuthFormCard
