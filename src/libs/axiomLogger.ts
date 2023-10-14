import { Logger } from 'next-axiom'

class MyLogger extends Logger {
  debug!: (
    message: any,
    args?: {
      [key: string]: any
    }
  ) => void
  info!: (
    message: any,
    args?: {
      [key: string]: any
    }
  ) => void
  warn!: (
    message: any,
    args?: {
      [key: string]: any
    }
  ) => void
  error!: (
    message: any,
    args?: {
      [key: string]: any
    }
  ) => void
}

export const logger = new MyLogger({
  autoFlush: true,
})
