import ConfigService from 'main/services/config.mjs'
import { CONFIGS, CONFIG_CHANNELS, CONFIG_CHANNELS_ } from './_constants.mjs'

export default async (ctx, messageContent) => {
  const { message } = ctx
  const config = messageContent.split(' ')[0]?.toLowerCase().trim()
  const rest = messageContent.substr(config.length + 1).trim()

  switch (config) {
    case CONFIG_CHANNELS.COMMAND_CHANNELS: return ConfigService.setCommandChannels(ctx, rest)
    case CONFIG_CHANNELS.LOGS_CHANNEL: return ConfigService.setLogsChannel(ctx, rest)
    default: return message.reply(
      `Please provide a valid config key:\`\`\`${ctx.botPrefix}config ${CONFIGS.CHANNELS} [${CONFIG_CHANNELS_.join('|')}] ...\`\`\``,
    )
  }
}
