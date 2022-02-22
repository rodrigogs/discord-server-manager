import isBot from 'main/validators/messages/is-bot.mjs'

export default {
  name: 'ping',
  description: 'Answers with pong',
  command: ['ping', 'p'],
  validator: [isBot(false)],
  processor: async (ctx) => await ctx.message.reply('pong'),
}
