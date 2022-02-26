export default class MessageRule {
  #name = null
  #description = null
  #command = null
  #validator = null
  #processor = null

  /**
   * Create a new rule
   * @param {String} name The name of the rule
   * @param {String} description The description of the rule
   * @param {String|String[]} [command=null] The command(s) that the rule responds to
   * @param {Function|Function[]} [validator=null] The validator(s) that the rule uses
   * @param {Function} processor The processor that the rule uses
   */
  constructor ({ name, description, command = null, validator = null, processor }) {
    this.#name = name
    this.#description = description
    this.#command = command
    this.#validator = validator
    this.#processor = processor
  }

  get name () {
    return this.#name
  }

  get description () {
    return this.#description
  }

  get command () {
    return this.#command
  }

  #getMessageContent (message) {
    const firstMessageChunk = message.content.split(' ')[0]
    return message.content.slice(firstMessageChunk.length + 1)
  }

  #validateCommand (context, rule) {
    if (rule.command === null) return true

    const firstMessageChunk = context.message.content.split(' ')[0]
    if (!firstMessageChunk.startsWith(context.botPrefix)) return false

    const messageCommand = firstMessageChunk.substr(context.botPrefix.length)
    if (rule.command instanceof Array) {
      return rule.command.includes(messageCommand)
    }

    return rule.command === messageCommand
  }

  #validateValidators (context) {
    if (!this.#validator) return true
    if (this.#validator instanceof Array) {
      return this.#validator.every((validator) => validator(context))
    }
    return this.#validator(context)
  }

  validate (context) {
    return this.#validateCommand(context, this) && this.#validateValidators(context)
  }

  async run (context) {
    const message = this.#getMessageContent(context.message)
    return this.#processor(context, message)
  }
}
