import logger from 'main/logger.mjs'
import AdminService from 'main/services/admin.mjs'

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
   * @param {Object[]} rules
   * @param {String} [rules[].name]
   * @param {String} [rules[].description]
   * @param {Function|Function[]} [rules[].validator]
   * @param {String|String[]} rules[].prefix
   * @param {Function} rules[].processor
   * @returns {Route}
   */
  addMessageRules (rules) {
    this.#messageRules.push(rules)
    return this
  }

  /**
   * @param {Object[]} rules
   * @param {String} [rules[].name]
   * @param {String} [rules[].description]
   * @param {Function|Function[]} [rules[].validator]
   * @param {Function} rules[].processor
   * @returns {Route}
   */
  addInteractionRules (rules) {
    this.#interactionRules.push(...rules)
    return this
  }

  #filterCommand (botPrefix, rule, message) {
    if (rule.command === null) return true

    const firstMessageChunk = message.content.split(' ')[0]
    if (!firstMessageChunk.startsWith(botPrefix)) return false

    const messageCommand = firstMessageChunk.substr(botPrefix.length)
    if (rule.command instanceof Array) {
      return rule.command.includes(messageCommand)
    }

    return rule.command === messageCommand
  }

  #filterValid (rule, message) {
    if (!rule.validator) return true
    if (rule.validator instanceof Array) {
      return rule.validator.every((validator) => validator(message))
    }
    return rule.validator(message)
  }

  #getMessageContent (message) {
    const firstMessageChunk = message.content.split(' ')[0]
    return message.content.slice(firstMessageChunk.length + 1)
  }

  async processMessage (message) {
    const botPrefix = await AdminService.getBotCommandsPrefix(message)
    const context = { ...this.#context, message, botPrefix }

    const rules = this.#messageRules
      .filter((rule) => this.#filterCommand(botPrefix, rule, message))
      .filter((rule) => this.#filterValid(rule, message))
    return Promise.all(rules.map(async (rule, i) => {
      try {
        logger.info(`[${i}] Processing message for rule ${rule.name}`)
        const messageContent = this.#getMessageContent(message)
        await rule.processor(context, messageContent)
      } catch (err) {
        logger.error(`Error processing message for rule ${rule.name || i}`, err)
      }
    }))
  }
}
