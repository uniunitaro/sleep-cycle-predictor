'use client'

import { ComponentProps, FC } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { chakra, useStyleConfig } from '@chakra-ui/react'

const ChakraNextLink = chakra<typeof NextLink, LinkProps>(NextLink)

const Link: FC<ComponentProps<typeof ChakraNextLink>> = ({
  children,
  ...props
}) => {
  const a = useStyleConfig('Link')

  return (
    <ChakraNextLink {...props} __css={a}>
      {children}
    </ChakraNextLink>
  )
}

export default Link
