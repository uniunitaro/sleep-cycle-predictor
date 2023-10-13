import { Button, Section, Text } from '@react-email/components'
import * as React from 'react'
import Layout from './components/Layout'

export const ConfirmEmail = () => {
  return (
    <Layout headingText="メールアドレスの変更を確認してください。">
      <Text className="text-black text-[14px]">
        あなたのメールアドレスは、 {'{{ .Email }}'} から {'{{ .NewEmail }}'}
        に変更されます。
        <br />
        以下のボタンを押して、新しいメールアドレスの確認を完了してください。
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          pX={20}
          pY={12}
          className="bg-[#38A169] rounded-full text-white text-[16px] font-semibold no-underline text-center"
          href="{{ .ConfirmationURL }}"
        >
          新しいメールアドレスを確認
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

export default ConfirmEmail
