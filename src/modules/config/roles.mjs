import { CONFIGS, CONFIG_ROLES, CONFIG_ROLES_ } from './_constants.mjs'
import ConfigService from 'main/services/config.mjs'

export default async (ctx, messageContent = '') => {
  const { message } = ctx
  const botPrefix = await ConfigService.getBotCommandsPrefix(message)
  const config = messageContent.split(' ')[0]?.toLowerCase().trim()
  const rest = messageContent.slice(config.length + 1).trim()

  switch (config) {
    case CONFIG_ROLES.ADMIN_ROLES: return ConfigService.setAdminRoles(ctx, rest)
    default: return message.reply(
      `Please provide a valid config key: \`\`\`${botPrefix}config ${CONFIGS.ROLES} [${CONFIG_ROLES_.join('|')}] ...\`\`\``,
    )
  }
}
