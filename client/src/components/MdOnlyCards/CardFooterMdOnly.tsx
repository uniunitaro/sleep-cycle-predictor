import { FC, memo } from 'react'
import { CardFooter, CardFooterProps } from '../chakra'

const CardFooterMdOnly: FC<CardFooterProps> = memo(({ children, ...rest }) => {
  return (
    <CardFooter px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardFooter>
  )
})

CardFooterMdOnly.displayName = 'CardFooterMdOnly'
export default CardFooterMdOnly
