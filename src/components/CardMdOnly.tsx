import { Card, CardProps } from '@chakra-ui/react'
import { FC } from 'react'

const CardMdOnly: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <Card
      bg={{ base: 'transparent', md: 'contentBg' }}
      borderRadius={{ base: 'none', md: 'xl' }}
      {...rest}
    >
      {children}
    </Card>
  )
}

export default CardMdOnly
