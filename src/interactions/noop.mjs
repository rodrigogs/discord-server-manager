import isBot from 'lib/validators/interactions/is-bot.mjs'
import logger from 'lib/logger.mjs'
import InteractionRule from 'lib/router/interaction-rule.mjs'

export default new InteractionRule({
  name: 'Noop',
  description: 'This is just for documentation',
  validator: [isBot(false)],
  processor: async (ctx) => {
    logger.info('Noop interaction rule triggered')
    logger.info(`ctx: ${JSON.stringify(ctx)}`)
  },
})
