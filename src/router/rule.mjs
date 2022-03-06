export default class Rule {
  #type = null
  #name = null
  #description = null
  #validator = null
  #processor = null

  /**
   * Create a new rule
   * @param {Object} options The options for the rule
   * @param {String} options.type The type of the rule
   * @param {String} options.name The name of the rule
   * @param {String} [options.description] The description of the rule
   * @param {String|String[]} [options.command=null] The command(s) that the rule responds to
   * @param {Function|Function[]} [options.validator=null] The validator(s) that the rule uses
   * @param {Function} options.processor The processor that the rule uses
   */
  constructor ({ type = null, name, description, validator = null, processor }) {
    this.#type = type
    this.#name = name
    this.#description = description
    this.#validator = validator
    this.#processor = processor
  }

  get name () {
    return this.#name
  }

  get description () {
    return this.#description
  }

  get type () {
    if (this.#type === null) throw new Error('Rule type is not defined')
    return this.#type
  }

  get processor () {
    return this.#processor
  }

  applyValidators (context) {
    if (!this.#validator) return true
    if (this.#validator instanceof Array) {
      return this.#validator.every((validator) => validator(context))
    }
    return this.#validator(context)
  }

  validate (context) {
    return this.applyValidators(context)
  }

  async run (context) {
    return this.#processor(context)
  }
}
