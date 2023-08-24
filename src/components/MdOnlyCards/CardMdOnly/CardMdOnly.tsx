import { FC } from 'react'
import { Card, CardProps } from '../../chakra'

const CardMdOnly: FC<CardProps> = ({ children, ...rest }) => {
  return (
    <Card
      bg={{ base: 'transparent', md: 'contentBg' }}
      borderRadius={{ base: 'none', md: '2xl' }}
      {...rest}
    >
      {children}
    </Card>
  )
}

export default CardMdOnly
