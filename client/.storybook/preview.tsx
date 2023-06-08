import type { Preview } from '@storybook/react'
import { theme } from '../src/libs/chakraTheme'
import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'
import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient, MuiTheme } from '../src/pages/_app'
import { initialize, mswDecorator } from 'msw-storybook-addon'
import { ThemeProvider } from '@mui/material'
import { handlers } from '../src/libs/msw'

interface ColorModeProps {
  colorMode: 'light' | 'dark'
  children: JSX.Element
}

function ColorMode(props: ColorModeProps) {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode(props.colorMode)
  }, [props.colorMode])

  return props.children
}

export const globalTypes = {
  colorMode: {
    name: 'Color Mode',
    defaultValue: 'light',
    toolbar: {
      items: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
      ],
      dynamicTitle: true,
    },
  },
}

initialize()

export const decorators = [
  (Story, context) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={MuiTheme(context.globals.colorMode)}>
          <ChakraProvider theme={theme}>
            <ColorMode colorMode={context.globals.colorMode}>
              <Story />
            </ColorMode>
          </ChakraProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  },
  mswDecorator,
]

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers,
    },
  },
  decorators: decorators,
}

export default preview
