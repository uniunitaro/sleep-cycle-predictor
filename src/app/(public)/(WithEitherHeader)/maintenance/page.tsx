import Image from 'next/image'
import Logo from '@/components/Logo/Logo'
import {
  BasicCard,
  BasicCardBody,
  BasicCardLayout,
} from '@/components/BasicCards'
import { Box, Heading, Text, VStack } from '@/components/chakra'
import notFoundImage from '@/assets/404.png'

const MaintenancePage = () => {
  return (
    <Box as="main" h="full">
      <BasicCardLayout>
        <BasicCard>
          <BasicCardBody>
            <VStack spacing="12" my="12">
              <Logo />
              <VStack spacing="4">
                <Heading size="lg">現在メンテナンス中です</Heading>
                <Text>
                  現在、システムメンテナンスのため、一時的にサービスを停止しております。
                  <br />
                  ご不便をおかけしますが、メンテナンス完了までお待ちいただきますようお願い申し上げます。
                </Text>
              </VStack>
              <Image src={notFoundImage} height="200" alt="Not Found" />
            </VStack>
          </BasicCardBody>
        </BasicCard>
      </BasicCardLayout>
    </Box>
  )
}

export default MaintenancePage
