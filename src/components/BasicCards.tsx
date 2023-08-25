import { FC, ReactNode } from 'react'
import { Card, Container } from './chakra'

export const BasicCardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container
      maxW="lg"
      py={{ base: '4', md: '8' }}
      px={{ base: '4', md: '8' }}
    >
      {children}
    </Container>
  )
}

export const BasicCard: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Card
      py={{ base: '0', md: '3' }}
      px={{ base: '0', md: '5' }}
      bg={{ base: 'transparent', md: 'contentBg' }}
      borderRadius={{ base: 'none', md: '2xl' }}
    >
      {children}
    </Card>
  )
}

export {
  CardHeaderMdOnly as BasicCardHeader,
  CardBodyMdOnly as BasicCardBody,
  CardFooterMdOnly as BasicCardFooter,
} from './MdOnlyCards'
