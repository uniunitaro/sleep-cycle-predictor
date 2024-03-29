import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  // Files to exclude
  exclude: [],
  // The output directory for your css system
  outdir: 'styled-system',
  presets: ['@pandacss/preset-base', '@park-ui/presets'],
  jsxFramework: 'react',
  theme: {
    extend: {
      slotRecipes: {
        datePicker: {
          base: {
            cellTrigger: {
              _today: {
                border:
                  '1px solid var(--chakra-colors-secondaryGray) !important',
                _before: {
                  content: '""',
                },
              },
            },
          },
        },
      },
    },
  },
})
