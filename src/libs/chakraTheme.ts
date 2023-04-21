import { StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

// https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/theme/src/foundations/colors.ts
// greenをbrandとして定義
const brand = {
  50: '#F0FFF4',
  100: '#C6F6D5',
  200: '#9AE6B4',
  300: '#68D391',
  400: '#48BB78',
  500: '#38A169',
  600: '#2F855A',
  700: '#276749',
  800: '#22543D',
  900: '#1C4532',
}

export const theme = extendTheme({
  semanticTokens: {
    colors: {
      secondaryGray: {
        default: '#68758d',
        _dark: 'gray.400',
      },
      contentBg: {
        default: 'white',
        _dark: 'gray.700',
      },
    },
  },
  colors: {
    brand,
  },
  components: {
    Input: {
      variants: {
        outline: (props: StyleFunctionProps) => ({
          field: {
            _focusVisible: {
              borderColor: mode('brand.500', 'brand.300')(props),
            },
            borderRadius: 'lg',
            bg: mode('white', 'whiteAlpha.50')(props),
          },
        }),
      },
    },
    Form: {
      parts: ['container'],
      baseStyle: {
        container: {
          label: {
            fontSize: 'sm',
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: '700',
        WebkitTapHighlightColor: 'transparent',
      },
    },
    Alert: {
      parts: ['container'],
      baseStyle: {
        container: {
          borderRadius: 'lg',
          fontSize: 'sm',
        },
      },
    },
    Card: {
      parts: ['container'],
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'none',
        },
      },
    },
    Popover: {
      parts: ['content'],
      baseStyle: {
        content: {
          boxShadow: 'lg',
          borderRadius: 'xl',
        },
      },
    },
    Modal: {
      parts: ['overlay', 'dialog'],
      baseStyle: {
        overlay: {
          bg: 'blackAlpha.400',
          backdropFilter: 'blur(20px) saturate(180%)',
        },
        dialog: {
          borderRadius: 'xl',
        },
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('#f7f9f7', 'gray.800')(props),
      },
    }),
  },
})
