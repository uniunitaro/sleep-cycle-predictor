import { useAtomValue } from 'jotai'
import { sleepAddCountAtom } from '../atoms/sleepAddCount'
import { installPromptAtom } from '@/atoms/installPrompt'

export const usePWAInstall = () => {
  const installPrompt = useAtomValue(installPromptAtom)

  const sleepAddCount = useAtomValue(sleepAddCountAtom)

  const hasDismissedPWAInstall =
    localStorage.getItem('hasDismissedPWAInstall') === 'true'

  const isMobileOrTablet =
    navigator.userAgent.includes('Mobi') ||
    navigator.userAgent.includes('Android')

  const shouldSuggestPWAInstall =
    !!installPrompt &&
    sleepAddCount >= 2 &&
    !hasDismissedPWAInstall &&
    isMobileOrTablet

  const canInstallPWA = !!installPrompt && isMobileOrTablet

  const handleInstall = () => {
    installPrompt?.prompt()
  }

  const handleDismiss = () => {
    localStorage.setItem('hasDismissedPWAInstall', 'true')
  }

  return {
    shouldSuggestPWAInstall,
    canInstallPWA,
    handleInstall,
    handleDismiss,
  }
}
