import fs from 'fs/promises'
import isBot from 'main/validators/messages/is-bot.mjs'
import MessageRule from 'main/router/message-rule.mjs'

const commands = (await fs.readdir('./src/commands').then((files) =>
  Promise.all(files
    .filter((file) => (['index.mjs', 'default.mjs', 'help.mjs'].indexOf(file) === -1))
    .map(async (file) => {
      const isDir = await fs.stat(`./src/commands/${file}`).then((stats) => stats.isDirectory())
      if (isDir) return (await import(`./${file}/index.mjs`)).default
      return (await import(`./${file}`)).default
    })),
)).reduce((acc, module) => {
  if (module instanceof Array) {
    for (const submodule of module) {
      if (!submodule.command) continue
      acc.push(submodule)
    }
    return acc
  }
  if (module.command === null) return acc
  acc.push(module)
  return acc
}, [])

export default new MessageRule({
  name: 'Help',
  description: 'Answers with a list of commands',
  command: ['help', 'h'],
  validator: [isBot(false)],
  processor: async (ctx) => {
    const message = `
Hello! I'm a bot that can help you manage your server.
Those are the commands I know:
${commands
        .filter(({ command }) => command !== undefined)
        .map((command) => `\`${ctx.botPrefix}${command.command}\` - ${command.description}`)
        .join('\n')}
`
    await ctx.message.reply(message)
  },
})
