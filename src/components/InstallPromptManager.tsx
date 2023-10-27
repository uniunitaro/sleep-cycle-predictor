'use client'

import { useSetAtom } from 'jotai'
import { FC, useEffect } from 'react'
import { installPromptAtom } from '@/atoms/installPrompt'
import { BeforeInstallPromptEvent } from '@/types/beforeInstallPromptEvent'

const InstallPromptManager: FC = () => {
  const setInstallPrompt = useSetAtom(installPromptAtom)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as any
    )
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as any
      )
    }
  }, [setInstallPrompt])

  return null
}

export default InstallPromptManager
