import { extendTheme } from '@chakra-ui/react'

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
  colors: {
    brand,
  },
  components: {
    Input: {
      variants: {
        outline: {
          field: {
            _focusVisible: {
              borderColor: 'brand.500',
            },
            borderRadius: 'lg',
          },
        },
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
  },
})
