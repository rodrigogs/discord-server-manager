import isBot from 'main/validators/messages/is-bot.mjs'
import MessageRule from 'main/router/message-rule.mjs'

export default [
  new MessageRule({
    name: 'Remember',
    description: 'Remember a value',
    command: ['remember', 'r'],
    validator: [isBot(false)],
    processor: async (ctx, messageContent) => {
      const { message } = ctx
      const [key = '', value = ''] = messageContent.split(' ')
      if (!key.trim() || !value.trim()) return await message.reply('Please provide a key and a value')
      await ctx.store.set('!remember', key, value)
      await message.reply(`Remembering ${key} as ${value}`)
    },
  }),
  new MessageRule({
    name: 'Forget',
    description: 'Forget a value',
    command: ['forget', 'f'],
    processor: async (ctx, messageContent) => {
      const { message } = ctx
      const key = messageContent
      if (!key) return await message.reply('Please provide a key')
      await ctx.store.set('!remember', key)
      await message.reply(`Forgetting ${key}`)
    },
  }),
  new MessageRule({
    name: 'Answer',
    description: 'Answer a value',
    command: ['answer', 'a'],
    processor: async (ctx, messageContent) => {
      const { message } = ctx
      const key = messageContent
      if (!key) return await message.reply('Please provide a key')
      const value = await ctx.store.get('!remember', key)
      if (!value) return await message.reply(`I don't know ${key}`)
      await message.reply(`${key} is ${value}`)
    },
  }),
]
