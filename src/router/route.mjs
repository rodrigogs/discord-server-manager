import logger from 'main/logger.mjs'
import ConfigService from 'main/services/config.mjs'

export default class Route {
  #context = null
  #messageRules = []
  #interactionRules = []
  #memberJoinedRules = []

  constructor (context, { messageRules = [], interactionRules = [], memberJoinedRules = [] }) {
    this.#context = context
    this.#messageRules = messageRules
    this.#interactionRules = interactionRules
    this.#memberJoinedRules = memberJoinedRules
  }

  /**
   * @param {import('./message-rule.mjs')[]} messageRules Message rules to add
   * @returns {Route}
   */
  addMessageRules (rules) {
    this.#messageRules.push(...rules)
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
   * @param {import('./member-joined-rule.mjs')[]} memberJoinedRules Member joined rules to add
   * @returns {Route}
   */
  addMemberJoinedRules (rules) {
    this.#memberJoinedRules.push(...rules)
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
        logger.info(`Processing message for rule [${rule.name || i}]`)
        await rule.run(context)
      } catch (err) {
        console.error(err)
        logger.error(`Error processing message for rule [${rule.name || i}]`, err.message)
      }
    }))
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   * @returns {Promise<void>}
   */
  async processInteraction (interaction) {
    const context = { ...this.#context, interaction }

    const rules = this.#interactionRules
      .filter((rule) => rule.validate(context))

    return Promise.all(rules.map(async (rule, i) => {
      try {
        logger.info(`Processing interaction for rule [${rule.name || i}]`)
        await rule.run(context)
      } catch (err) {
        console.error(err)
        logger.error(`Error processing interaction for rule [${rule.name || i}]`, err.message)
      }
    }))
  }

  /**
   * @param {import('discord.js').GuildMember} member
   * @returns {Promise<void>}
   */
  async processMemberJoined (member) {
    const context = { ...this.#context, member }

    const rules = this.#memberJoinedRules
      .filter((rule) => rule.validate(context))

    return Promise.all(rules.map(async (rule, i) => {
      try {
        logger.info(`Processing member joined for rule [${rule.name || i}]`)
        await rule.run(context)
      } catch (err) {
        console.error(err)
        logger.error(`Error processing member joined for rule [${rule.name || i}]`, err.message)
      }
    }))
  }
}
