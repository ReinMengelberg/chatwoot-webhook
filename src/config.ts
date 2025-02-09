/**
 * Anything that you would like to make configurable to the bot owner would go in this file.
 * Botpress handles itself loading the configuration files.
 *
 * Bot configuration files will override Global configuration when available:
 * For example, `data/bots/MY_BOT/config/starter-module.json` will be used by MY_BOT, while `data/global/config/starter-module.json` will be used for all others
 */
export interface Config {
  /**
   * @default https://botpress.com
   */
  someEndpoint: string
  /**
   * @default 10
   */
  maxMessages: number
  /**
   * @default your_secure_string
   */
  secureString: string
  /**
   * @default 2
   */
  timezone: number
  /**
   * @default nl
   */
  languageCode: string
}
