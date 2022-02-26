import logger from 'main/logger.mjs'
import ConfigService from 'main/services/config.mjs'

export default class Route {
  #context = null
  #messageRules = []
  #interactionRules = []

  constructor (context, { messageRules = [], interactionRules = [] }) {
    this.#context = context
    this.#messageRules = messageRules
    this.#interactionRules = interactionRules
  }

  /**
   * @param {import('./message-rule.mjs')[]} messageRules Message rules to add
   * @returns {Route}
   */
  addMessageRules (rules) {
    this.#messageRules.push(rules)
    return this
  }

  /**
   * @param {import('./interaction-rule.mjs')[]} interactionRules Interaction rules to add
   * @returns {Route}
   */
  addInteractionRules (rules) {
    this.#interactionRules.push(...rules)
    return this
  }

  /**
   *
   * @param {import('discord.js').Message} message
   * @returns {Promise<void>}
   */
  async processMessage (message) {
    const botPrefix = await ConfigService.getBotCommandsPrefix(message)
    const context = { ...this.#context, message, botPrefix }

    const rules = this.#messageRules
      .filter((rule) => rule.validate(context))

    return Promise.all(rules.map(async (rule, i) => {
      try {
        logger.info(`[${i}] Processing message for rule ${rule.name}`)
        await rule.run(context)
      } catch (err) {
        console.error(err)
        logger.error(`Error processing message for rule ${rule.name || i}`, err.message)
      }
    }))
  }
}
