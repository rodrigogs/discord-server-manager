import ConfigService from 'main/services/config.mjs'
import { CONFIGS, CONFIG_CHANNELS, CONFIG_CHANNELS_ } from './_constants.mjs'

export default async (ctx, messageContent) => {
  const { message } = ctx
  const config = messageContent?.split(' ')[0]?.trim()
  const rest = messageContent?.slice(config.length + 1)

  switch (config) {
    case CONFIG_CHANNELS.commandChannels: return ConfigService.setCommandChannels(ctx, rest)
    case CONFIG_CHANNELS.logsChannel: return ConfigService.setLogsChannel(ctx, rest)
    default: return message.reply(
      `Please provide a valid config key:\`\`\`${ctx.botPrefix}config ${CONFIGS.channels} [${CONFIG_CHANNELS_.join('|')}] ...\`\`\``,
    )
  }
}
