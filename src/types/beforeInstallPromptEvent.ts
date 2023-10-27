export type BeforeInstallPromptEvent = Event & {
  readonly platforms: Array<string>

  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>

  prompt(): Promise<void>
}
