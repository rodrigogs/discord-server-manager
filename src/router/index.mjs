import logger from 'main/logger.mjs'
import Route from './route.mjs'
import MessageRule from './message-rule.mjs'
import InteractionRule from './interaction-rule.mjs'
import MemberJoinedRule from './member-joined-rule.mjs'
// import fs from 'fs'

export default class Router {
  #discordClient = null
  #messageRoutes = []
  #interactionRoutes = []
  #memberJoinedRoutes = []

  constructor (discorClient) {
    this.#discordClient = discorClient
    this.#registerEvents()
  }

  #registerEvents () {
    this.#discordClient.on('messageCreate', (message) => this.#onMessage(message))
    this.#discordClient.on('interactionCreate', (interaction) => this.#onInteraction(interaction))
    this.#discordClient.on('guildMemberAdd', (member) => this.#onMemberJoined(member))
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
    this.#interactionRoutes.forEach(route => {
      route.processInteractions(interaction)
    })
  }

  #onMemberJoined (member) {
    logger.debug(`Router.onMemberJoined: ( User: ${member.user.tag} )`)
    // fs.writeFileSync(`./test/fixtures/member-joined-guild/dm-${Date.now()}.json`, JSON.stringify(interaction, null, 2))
    this.#memberJoinedRoutes.forEach(route => {
      route.processMemberJoined(member)
    })
  }

  get #context () {
    return {
      router: this,
      discordClient: this.#discordClient,
    }
  }

  addMessageRoute (messageRule) {
    logger.debug(`Adding message route for rule: ${messageRule.name}`)
    const route = new Route(this.#context, { messageRules: [messageRule] })
    this.#messageRoutes.push(route)
    return this
  }

  addMessageRoutes (messageRules = []) {
    for (const messageRule of messageRules) {
      this.addMessageRoute(messageRule)
    }
    return this
  }

  addInteractionRoute (interactionRule) {
    logger.debug(`Adding message route: ${interactionRule.name}`)
    const route = new Route(this.#context, { interactionRules: [interactionRule] })
    this.#interactionRoutes.push(route)
    return this
  }

  addInteractionRoutes (interactionRules = []) {
    for (const interactionRule of interactionRules) {
      this.addInteractionRoute(interactionRule)
    }
    return this
  }

  addMemberJoinedRoute (memberJoinedRule) {
    logger.debug(`Adding member joined route: ${memberJoinedRule.name}`)
    const route = new Route(this.#context, { memberJoinedRules: [memberJoinedRule] })
    this.#memberJoinedRoutes.push(route)
    return this
  }

  addMemberJoinedRoutes (memberJoinedRules = []) {
    for (const memberJoinedRule of memberJoinedRules) {
      this.addMemberJoinedRoute(memberJoinedRule)
    }
    return this
  }
}

export {
  Router,
  Route,
  MessageRule,
  InteractionRule,
  MemberJoinedRule,
}
