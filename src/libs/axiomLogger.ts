import { Logger } from 'next-axiom'

export const log = {
  debug: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.debug(message.toString(), args)
    await logger.flush()
  },
  info: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.info(message.toString(), args)
    await logger.flush()
  },
  warn: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.warn(message.toString(), args)
    await logger.flush()
  },
  error: async (message: any, args?: { [key: string]: any }) => {
    const logger = new Logger()
    logger.error(message.toString(), args)
    await logger.flush()
  },
}
