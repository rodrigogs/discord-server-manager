import logger from 'main/logger.mjs'
import Route from './route.mjs'
import MessageRule from './message-rule.mjs'
import InteractionRule from './interaction-rule.mjs'
// import fs from 'fs'

export default class Router {
  #discordClient = null
  #messageRoutes = []
  #interactionRules = []

  constructor (discorClient) {
    this.#discordClient = discorClient
    this.#registerEvents()
  }

  #registerEvents () {
    this.#discordClient.on('messageCreate', (message) => this.#onMessage(message))
    this.#discordClient.on('interactionCreate', (interaction) => this.#onInteraction(interaction))
  }

  #onMessage (message) {
    logger.debug(
      `Router.onMessage: ( User: ${message.author.tag}, Content: ${message.content}, Bot: ${message.author.bot} )`,
    )
    // fs.writeFileSync(`./test/fixtures/messages/random-text-guild.json`, JSON.stringify(message, null, 2))
    this.#messageRoutes.forEach(route => {
      route.processMessage(message)
    })
  }

  #onInteraction (interaction) {
    logger.debug(
      `Router.onInteraction: ( CustomId: ${interaction.customId}, Content: ${interaction.content}, Bot: ${interaction.bot} )`,
    )
    // fs.writeFileSync(`./test/fixtures/interactions/dm-${Date.now()}.json`, JSON.stringify(interaction, null, 2))
    this.#interactionRules.forEach(route => {
      route.processInteractions(interaction)
    })
  }

  get #context () {
    return {
      router: this,
      discordClient: this.#discordClient,
    }
  }

  addMessageRoutes (messageRules = []) {
    for (const messageRule of messageRules) {
      this.addMessageRoute(messageRule)
    }
    return this
  }

  addInteractionRoutes (interactionRules = []) {
    for (const interactionRule of interactionRules) {
      this.addInteractionRoute(interactionRule)
    }
    return this
  }

  addMessageRoute (messageRule) {
    logger.debug(`Adding message route for rule: ${messageRule.name}`)
    const route = new Route(this.#context, { messageRules: [messageRule] })
    this.#messageRoutes.push(route)
    return this
  }

  addInteractionRoute (interactionRule) {
    logger.debug(`Adding message route: ${interactionRule.name}`)
    const route = new Route(this.#context, { interactionRules: [interactionRule] })
    this.#messageRoutes.push(route)
    return this
  }
}

export {
  Router,
  Route,
  MessageRule,
  InteractionRule,
}
