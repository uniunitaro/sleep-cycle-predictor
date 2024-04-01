'use client'

import { useLogger } from 'next-axiom'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button, Center, Heading, Stack } from '@chakra-ui/react'

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
    <Center pt="40">
      <Stack gap="5">
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
