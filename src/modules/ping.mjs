import isBot from 'main/validators/messages/is-bot.mjs'
import MessageRule from 'main/router/message-rule.mjs'

export default new MessageRule({
  name: 'ping',
  description: 'Answers with pong',
  command: ['ping', 'p'],
  validator: [isBot(false)],
  processor: async (ctx) => await ctx.message.reply('pong'),
})
