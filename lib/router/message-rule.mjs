import Rule from './rule.mjs'
import { RULE_TYPES } from './_rule-types.mjs'

export default class MessageRule extends Rule {
  #command = null

  /**
   * Create a new rule
   * @param {Object} options The options for the rule
   * @param {String} options.name The name of the rule
   * @param {String} [options.description] The description of the rule
   * @param {String|String[]} [options.command=null] The command(s) that the rule responds to
   * @param {Function|Function[]} [options.validator=null] The validator(s) that the rule uses
   * @param {Function} options.processor The processor that the rule uses
   */
  constructor (options) {
    super({ ...options, type: RULE_TYPES.message })
    this.#command = options.command
  }

  get command () {
    return this.#command
  }

  #getMessageContent (message) {
    const firstMessageChunk = message.content.split(' ')[0]
    return message.content.slice(firstMessageChunk.length + 1)
  }

  #validateCommand (context) {
    if (this.command === null) return true

    const { message, botPrefix } = context
    const messageContentWithtouBotPrefix = message.content.slice(botPrefix.length)
    const command = messageContentWithtouBotPrefix.split(' ')[0]?.trim()

    if (this.command instanceof Array) {
      return this.command.includes(command)
    }

    return this.command === command
  }

  validate (context) {
    return this.#validateCommand(context) && this.applyValidators(context)
  }

  async run (context) {
    const message = this.#getMessageContent(context.message)
    return this.processor(context, message)
  }
}
