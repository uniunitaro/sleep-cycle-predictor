import { FC } from 'react'
import {
  Card,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
} from './chakra'

export const CardMdOnly: FC<CardProps> = ({ children, ...rest }) => {
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

export const CardHeaderMdOnly: FC<CardHeaderProps> = ({
  children,
  ...rest
}) => {
  return (
    <CardHeader px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardHeader>
  )
}

export const CardBodyMdOnly: FC<CardBodyProps> = ({ children, ...rest }) => {
  return (
    <CardBody px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardBody>
  )
}
export const CardFooterMdOnly: FC<CardFooterProps> = ({
  children,
  ...rest
}) => {
  return (
    <CardFooter px={{ base: 0, md: 5 }} {...rest}>
      {children}
    </CardFooter>
  )
}
