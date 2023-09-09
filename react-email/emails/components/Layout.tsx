import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { FC, ReactNode } from 'react'

const Layout: FC<{ headingText: string; children: ReactNode }> = ({
  headingText,
  children,
}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white">
          <Container className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded-[12px] my-[40px] mx-auto p-[20px] max-w-[465px]">
              <Section className="mt-[32px]">
                <Img
                  src="https://www.sleep-predictor.com/logo-light.png"
                  width="160"
                  alt="Sleep Predictor"
                  className="mx-auto"
                />
              </Section>
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                {headingText}
              </Heading>
              {children}
              <Section className="text-center mt-[20px]">
                <Text className="text-[#666666] text-[12px] leading-[24px]">
                  © 2023 Sleep Predictor
                </Text>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default Layout
