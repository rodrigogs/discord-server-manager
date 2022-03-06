import logger from 'main/logger.mjs'
import configureRolesSettings from './roles.mjs'
import configureChannelsSettings from './channels.mjs'
import { CONFIGS, CONFIGS_ } from './_constants.mjs'
import { isGuild, isBot } from 'main/validators/messages/index.mjs'
import MessageRule from 'main/router/message-rule.mjs'
import ConfigService from 'main/services/config.mjs'

const processor = async (ctx, messageContent) => {
  const { message, botPrefix } = ctx
  const config = messageContent?.split(' ')[0]?.trim()
  const rest = messageContent?.slice(config.length + 1)

  try {
    switch (config) {
      case CONFIGS.prefix: return await ConfigService.setBotCommandsPrefix(ctx, rest)
      case CONFIGS.channels: return await configureChannelsSettings(ctx, rest)
      case CONFIGS.roles: return await configureRolesSettings(ctx, rest)
      default: return await message.reply(`Please provide a valid config key: \`\`\`${botPrefix}config [${CONFIGS_.join('|')}] ...\`\`\``)
    }
  } catch (err) {
    logger.error('Error while processing configs command', err)
    return await message.reply(`Something went wrong: ${err.stack}`)
  }
}

export default new MessageRule({
  name: 'Config',
  description: 'Configure the bot',
  command: 'config',
  validator: [isBot(false), isGuild()],
  processor,
})
