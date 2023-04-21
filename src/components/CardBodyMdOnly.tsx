import { CardBody, CardBodyProps } from '@chakra-ui/react'
import { FC, memo } from 'react'

const CardBodyMdOnly: FC<CardBodyProps> = memo(({ children, ...rest }) => {
  return (
    <CardBody px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardBody>
  )
})

CardBodyMdOnly.displayName = 'CardBodyMdOnly'
export default CardBodyMdOnly
