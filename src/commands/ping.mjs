import isBot from 'lib/validators/messages/is-bot.mjs'
import MessageRule from 'lib/router/message-rule.mjs'

export default new MessageRule({
  name: 'ping',
  description: 'Answers with pong',
  command: ['ping'],
  validator: [isBot(false)],
  processor: async (ctx) => await ctx.message.reply('pong'),
})
