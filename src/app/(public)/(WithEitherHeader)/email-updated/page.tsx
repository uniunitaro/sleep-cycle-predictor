import Logo from '@/components/Logo/Logo'
import CardMdOnly from '@/components/MdOnlyCards/CardMdOnly/CardMdOnly'
import { Box, CardBody, Center, Container } from '@/components/chakra'
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
    <Box h="full">
      <Container
        maxW="lg"
        py={{ base: '4', md: '8' }}
        px={{ base: '0', md: '8' }}
      >
        <CardMdOnly>
          <CardBody>
            <Center my="14">
              <Logo />
            </Center>
            <Center my="14">
              <Box fontWeight="bold">
                {isError
                  ? '正しくない操作が行われました。'
                  : 'メールアドレスの変更が完了しました。'}
              </Box>
            </Center>
          </CardBody>
        </CardMdOnly>
      </Container>
    </Box>
  )
}

export default EmailUpdatedPage
