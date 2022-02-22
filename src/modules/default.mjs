import { isBot, content } from 'main/validators/messages/index.mjs'

export default {
  name: 'Default',
  description: 'Shows the default help message',
  command: null,
  validator: [isBot(false), content({ exact: '!' })],
  processor: async (ctx) => await ctx.message.reply(`
Hello! I'm a bot that can help you manage your server.
You can use \`${ctx.botPrefix}help\` to see the list of commands.
  `),
}
