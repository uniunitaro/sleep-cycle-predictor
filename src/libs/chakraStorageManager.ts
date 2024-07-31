import { ColorMode } from '@chakra-ui/react'

export const CUSTOM_LOCAL_STORAGE_KEY = 'custom-chakra-ui-color-mode'
export const LOCAL_STORAGE_USE_SYSTEM_KEY = 'useSystemColorMode'

type MaybeColorMode = ColorMode | undefined
interface StorageManager {
  type: 'cookie' | 'localStorage'
  ssr?: boolean
  get(init?: ColorMode): MaybeColorMode
  set(value: ColorMode | 'system'): void
}

// なんかこれでできてる
export class CustomColorModeManager implements StorageManager {
  systemColorMode: ColorMode | undefined

  storageType: 'localStorage' | 'cookie' = 'localStorage'

  get type() {
    return this.storageType
  }

  ssr = false

  get(init: ColorMode): MaybeColorMode {
    if (!(globalThis == null ? void 0 : globalThis.document)) return init
    let value
    let useSystemColorMode
    try {
      value =
        (localStorage.getItem(CUSTOM_LOCAL_STORAGE_KEY) as MaybeColorMode) ||
        init

      const useSystemColorModeResult = localStorage.getItem(
        LOCAL_STORAGE_USE_SYSTEM_KEY
      )
      useSystemColorMode =
        useSystemColorModeResult === 'true' || useSystemColorModeResult === null
    } catch (e) {
      /* empty */
    }

    if (useSystemColorMode) {
      return CustomColorModeManager.currentColorMode()
    }

    return value || init
  }

  set(value: ColorMode | 'system') {
    try {
      localStorage.setItem(CUSTOM_LOCAL_STORAGE_KEY, value)
    } catch (e) {
      /* empty */
    }
  }

  static currentColorMode(): ColorMode {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
}

// export class MemoryColorModeManager {
//   colorMode: ColorMode | undefined

//   storageType: 'localStorage' | 'cookie' = 'localStorage'

//   get type() {
//     return this.storageType
//   }

//   ssr = false

//   get(): ColorMode | undefined {
//     return this.colorMode
//   }

//   set(value: ColorMode | 'system') {
//     if (value === 'system') {
//       this.colorMode = MemoryColorModeManager.currentColorMode()

//     } else {
//       this.colorMode = value
//     }
//   }

//   static currentColorMode(): ColorMode {
//     return window.matchMedia('(prefers-color-scheme: dark)').matches
//       ? 'dark'
//       : 'light'
//   }
// }

// function createLocalStorageManager(key: string): StorageManager {
//   return {
//     ssr: false,
//     type: 'localStorage',
//     get(init) {
//       if (!(globalThis == null ? void 0 : globalThis.document)) return init
//       let value
//       try {
//         value = (localStorage.getItem(key) as MaybeColorMode) || init
//       } catch (e) {
//         /* empty */
//       }
//       return value || init
//     },
//     set(value) {
//       try {
//         console.log('value:', value)
//         if (value !== 'system') {
//           localStorage.setItem(key, value)
//         }
//       } catch (e) {
//         /* empty */
//       }
//     },
//   }
// }

export const customLocalStorageManager = new CustomColorModeManager()
