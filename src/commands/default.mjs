import { isBot, content } from 'lib/validators/messages/index.mjs'
import MessageRule from 'lib/router/message-rule.mjs'
import { MessageButton, MessageActionRow } from 'discord.js'

const getBotInviteLink = (id) => `https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`

export default new MessageRule({
  name: 'Default',
  description: 'Shows the default help message',
  command: null,
  validator: [isBot(false), content({ exact: '!' })],
  processor: async (ctx) => await ctx.message.reply({
    content: `
Hello! I'm a bot that can help you manage your server.
You can use \`${ctx.botPrefix}help\` to see the list of commands.`,
    components: [
      new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setURL(getBotInviteLink(ctx.discordClient.user.id))
            .setLabel('Add me to your server')
            .setStyle('LINK'),
        ),
    ],
  }),
})
