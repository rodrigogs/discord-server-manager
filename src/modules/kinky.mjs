import kinkyQuote from 'kinky-quote'
import isBot from 'main/validators/messages/is-bot.mjs'
import MessageRule from 'main/router/message-rule.mjs'

export default new MessageRule({
  name: 'Kinky quote',
  description: 'Answers with a random kinky quote',
  command: ['kinky', 'k'],
  validator: [isBot(false)],
  processor: async (ctx) => ctx.message.reply(await kinkyQuote()),
})
