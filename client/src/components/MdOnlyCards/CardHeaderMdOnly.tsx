import { FC, memo } from 'react'
import { CardHeader, CardHeaderProps } from '../chakra'

const CardHeaderMdOnly: FC<CardHeaderProps> = memo(({ children, ...rest }) => {
  return (
    <CardHeader px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardHeader>
  )
})

CardHeaderMdOnly.displayName = 'CardHeaderMdOnly'
export default CardHeaderMdOnly
