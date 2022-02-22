import kinkyQuote from 'kinky-quote'
import isBot from 'main/validators/messages/is-bot.mjs'

export default {
  name: 'Kinky quote',
  description: 'Answers with a random kinky quote',
  command: ['kinky', 'k'],
  validator: [isBot(false)],
  processor: async (ctx) => ctx.message.reply(await kinkyQuote()),
}
