import { useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import { FC, ReactNode } from 'react'

const ThemeColorWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const themeColor = useColorModeValue('#f7f9f7', '#1A202C')

  return (
    <>
      <Head>
        <meta name="theme-color" content={themeColor} />
      </Head>
      {children}
    </>
  )
}

export default ThemeColorWrapper
