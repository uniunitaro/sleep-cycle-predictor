import { Logger } from 'next-axiom'

export const log = {
  debug: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.debug(message, args)
    await logger.flush()
  },
  info: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.info(message, args)
    await logger.flush()
  },
  warn: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.warn(message, args)
    await logger.flush()
  },
  error: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.error(message, args)
    await logger.flush()
  },
}
