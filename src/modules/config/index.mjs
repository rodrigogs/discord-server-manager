import logger from 'main/logger.mjs'
import configureRolesSettings from './roles.mjs'
import configureChannelsSettings from './channels.mjs'
import { CONFIGS, CONFIGS_ } from './_constants.mjs'
import { isGuild, isBot } from 'main/validators/messages/index.mjs'
import MessageRule from 'main/router/message-rule.mjs'

const processor = async (ctx, messageContent) => {
  const { message } = ctx
  const config = messageContent.split(' ')[0]?.toLowerCase().trim()
  const rest = messageContent.slice(config.length + 1).trim()

  try {
    switch (config) {
      case CONFIGS.CHANNELS: return await configureChannelsSettings(ctx, rest)
      case CONFIGS.ROLES: return await configureRolesSettings(ctx, rest)
      default: return await message.reply(`Please provide a valid config key: \`\`\`!config [${CONFIGS_.join('|')}] ...\`\`\``)
    }
  } catch (err) {
    logger.error('Error while processing configs command', err)
    return await message.reply(`Something went wrong: ${err.stack}`)
  }
}

export default [
  new MessageRule({
    name: 'Config',
    description: 'Configure the bot',
    command: 'config',
    validator: [isBot(false), isGuild()],
    processor,
  }),
]
