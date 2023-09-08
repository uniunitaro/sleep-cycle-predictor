import {
  StyleFunctionProps,
  ThemeConfig,
  extendTheme,
  theme as originalTheme,
} from '@chakra-ui/react'
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

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
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
      chartBrand: {
        default: 'brand.300',
        _dark: 'brand.500',
      },
      chartBlue: {
        default: 'blue.300',
        _dark: 'blue.500',
      },
      globalBg: {
        default: '#f7f9f7',
        _dark: 'gray.800',
      },
      dayRed: {
        default: 'red.600',
        _dark: 'red.300',
      },
      dayBlue: {
        default: 'blue.600',
        _dark: 'blue.300',
      },
      buttonBrand: {
        default: 'brand.500',
        _dark: 'brand.200',
      },
      linkBlue: {
        default: 'blue.600',
        _dark: 'blue.300',
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
            borderRadius: 'xl',
            bg: mode('white', 'whiteAlpha.50')(props),
          },
        }),
      },
    },
    Select: {
      variants: {
        outline: (props: StyleFunctionProps) => ({
          field: {
            _focusVisible: {
              borderColor: mode('brand.500', 'brand.300')(props),
            },
            borderRadius: 'xl',
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
        borderRadius: 'full',
        fontWeight: '700',
        WebkitTapHighlightColor: 'transparent',
        _hover: {},
        '@media(hover: hover) and (pointer: fine)': {
          _hover: {
            ...originalTheme.components.Button.baseStyle?._hover,
          },
        },
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          _hover: {
            bg: originalTheme.components.Button.variants?.solid(props).bg,
          },
          '@media(hover: hover) and (pointer: fine)': {
            _hover: {
              ...originalTheme.components.Button.variants?.solid(props)._hover,
            },
          },
        }),
        outline: (props: StyleFunctionProps) => ({
          _hover: {
            bg: originalTheme.components.Button.variants?.outline(props).bg,
          },
          '@media(hover: hover) and (pointer: fine)': {
            _hover: {
              ...originalTheme.components.Button.variants?.outline(props),
            },
          },
        }),
        ghost: (props: StyleFunctionProps) => ({
          _hover: {
            bg:
              originalTheme.components.Button.variants?.ghost(props).bg ??
              'initial',
          },
          '@media(hover: hover) and (pointer: fine)': {
            _hover: {
              ...originalTheme.components.Button.variants?.ghost(props)._hover,
            },
          },
        }),
        link: (props: StyleFunctionProps) => ({
          _hover: {
            textDecoration: 'none',
          },
          '@media(hover: hover) and (pointer: fine)': {
            _hover: {
              ...originalTheme.components.Button.variants?.link(props)._hover,
            },
          },
        }),
        shadow: (props: StyleFunctionProps) => ({
          ...originalTheme.components.Button.variants?.solid(props),
          _hover: {
            bg: originalTheme.components.Button.variants?.solid(props).bg,
          },
          boxShadow:
            '0px 1px 2px 0px rgba(60,64,67,0.3),0px 1px 3px 1px rgba(60,64,67,0.15)',
          '@media(hover: hover) and (pointer: fine)': {
            _hover: {
              ...originalTheme.components.Button.variants?.solid(props)._hover,
              boxShadow:
                '0px 4px 4px 0px rgba(60,64,67,0.3),0px 8px 12px 6px rgba(60,64,67,0.15)',
            },
          },
        }),
      },
    },
    Alert: {
      parts: ['container'],
      baseStyle: {
        container: {
          borderRadius: 'xl',
          fontSize: 'sm',
        },
      },
    },
    Card: {
      parts: ['container'],
      baseStyle: {
        container: {
          borderRadius: '2xl',
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
        // overlay: {
        //   bg: 'blackAlpha.400',
        //   backdropFilter: 'blur(20px) saturate(180%)',
        // },
        dialog: {
          borderRadius: '2xl',
        },
      },
    },
    Menu: {
      parts: ['list'],
      baseStyle: {
        list: {
          borderRadius: 'xl',
          boxShadow: 'lg',
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'linkBlue',
      },
    },
    Tooltip: {
      baseStyle: {
        borderRadius: 'md',
      },
    },
    Container: {
      baseStyle: {
        px: { base: 4, md: 6 },
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: 'globalBg',
        scrollbarWidth: 'thin',
        fontFeatureSettings: 'normal',
      },
      '@media(hover: hover) and (pointer: fine)': {
        '::-webkit-scrollbar': {
          width: '16px',
          height: '16px',
        },
        '::-webkit-scrollbar-thumb': {
          bg: mode('blackAlpha.400', 'whiteAlpha.400')(props),
          borderRadius: '8px',
          border: '4px solid transparent',
          backgroundClip: 'content-box',
          '&:hover': {
            bg: mode('blackAlpha.600', 'whiteAlpha.600')(props),
            borderRadius: '8px',
            border: '4px solid transparent',
            backgroundClip: 'content-box',
          },
        },
      },
      '*': {
        scrollbarWidth: 'thin',
      },
    }),
  },
  fonts: {
    heading: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif',
    body: 'var(--font-roboto), var(--font-noto-sans-jp), sans-serif',
  },
  config,
})
