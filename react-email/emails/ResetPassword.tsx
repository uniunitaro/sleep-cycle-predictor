import { Button, Section, Text } from '@react-email/components'
import * as React from 'react'
import Layout from './components/Layout'

export const ResetPassword = () => {
  return (
    <Layout headingText="パスワードのリセット">
      <Text className="text-black text-[14px]">
        以下のボタンを押して、新しいパスワードに変更してください。
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          pX={20}
          pY={12}
          className="bg-[#38A169] rounded-full text-white text-[16px] font-semibold no-underline text-center"
          href="{{ .ConfirmationURL }}"
        >
          パスワードをリセットする
        </Button>
      </Section>
      {/* <Text className="text-black text-[14px] leading-[24px]">
        アクセスできない場合は、以下のリンクをコピーしてブラウザに貼り付けてください。
        <br />
        <Link
          href="{{ .ConfirmationURL }}"
          className="text-blue-600 no-underline"
        >
          {'{{ .ConfirmationURL }}'}
        </Link>
      </Text> */}
    </Layout>
  )
}

export default ResetPassword
