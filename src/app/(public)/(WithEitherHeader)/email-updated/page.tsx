import { Box, Center } from '@chakra-ui/react'
import Logo from '@/components/Logo/Logo'
import {
  BasicCard,
  BasicCardBody,
  BasicCardLayout,
} from '@/components/BasicCards'
import { updateEmail } from '@/features/user/repositories/users'
import { SearchParams } from '@/types/global'

const EmailUpdatedPage = async ({
  searchParams,
}: {
  searchParams: SearchParams
}) => {
  const isError = await (async () => {
    if (typeof searchParams.id !== 'string') {
      return true
    }

    const { error } = await updateEmail(searchParams.id)
    if (error) {
      return true
    }

    return false
  })()

  return (
    <Box as="main" h="full">
      <BasicCardLayout>
        <BasicCard>
          <BasicCardBody>
            <Center my="12">
              <Logo />
            </Center>
            <Center my="12">
              <Box fontWeight="bold">
                {isError
                  ? '正しくない操作が行われました。'
                  : 'メールアドレスの変更が完了しました。'}
              </Box>
            </Center>
          </BasicCardBody>
        </BasicCard>
      </BasicCardLayout>
    </Box>
  )
}

export default EmailUpdatedPage
