import { Router, Store, commands, events, logger } from 'main'
import { RULE_TYPES } from 'main/router/_constants.mjs'

export default (client) => {
  client.user.setActivity(`on ${client.guilds.cache.size} servers`)

  const router = new Router(client, new Store())

  const features = { ...commands, ...events }
  const keys = Object.keys(features)
  for (const key of keys) {
    logger.debug(`Loading module ${key}`)
    const modules = features[key] instanceof Array ? features[key] : [features[key]]
    for (const module of modules) {
      switch (module.type) {
        case RULE_TYPES.message:
          router.addMessageRoute(module)
          break
        case RULE_TYPES.interaction:
          router.addInteractionRoute(module)
          break
        case RULE_TYPES.memberJoined:
          router.addMemberJoinedRoute(module)
          break
        default:
          break
      }
    }
  }
}
