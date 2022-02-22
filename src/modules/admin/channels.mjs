import AdminService from 'main/services/admin.mjs'
import { CONFIGS, CONFIG_CHANNELS, CONFIG_CHANNELS_ } from './_constants.mjs'

export default async (ctx, messageContent) => {
  const { message } = ctx
  const config = messageContent.split(' ')[0]?.toLowerCase().trim()
  const rest = messageContent.substr(config.length + 1).trim()

  switch (config) {
    case CONFIG_CHANNELS.COMMAND_CHANNELS: return AdminService.setCommandChannels(ctx, rest)
    case CONFIG_CHANNELS.LOGS_CHANNEL: return AdminService.setLogsChannel(ctx, rest)
    default: return message.reply(
      `Please provide a valid config key:\`\`\`${ctx.botPrefix}admin ${CONFIGS.CHANNELS} [${CONFIG_CHANNELS_.join('|')}] ...\`\`\``,
    )
  }
}
