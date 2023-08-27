import { FC, ReactNode } from 'react'
import { Heading } from './chakra'

const SectionHeading: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Heading as="h2" size="md" pt="10" pb="4">
      {children}
    </Heading>
  )
}

export default SectionHeading
