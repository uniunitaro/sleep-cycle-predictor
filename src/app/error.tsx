'use client'

import { useLogger } from 'next-axiom'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button, Heading } from '@/components/chakra'
import { Center, Stack } from '@styled-system/jsx'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  const log = useLogger()

  useEffect(() => {
    log.error(error.toString())
  }, [error, log])

  return (
    <Center h="full">
      <Stack>
        <Heading size="md">エラーが発生しました</Heading>
        <Button as={Link} colorScheme="brand" variant="outline" href="/">
          トップページに戻る
        </Button>
        <Button
          colorScheme="brand"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          再試行
        </Button>
      </Stack>
    </Center>
  )
}

export default Error
