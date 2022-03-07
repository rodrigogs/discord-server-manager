import { CONFIGS, CONFIG_ROLES, CONFIG_ROLES_ } from './_constants.mjs'
import ConfigService from 'bot/services/config.mjs'

export default async (ctx, messageContent = '') => {
  const { message, botPrefix } = ctx
  const config = messageContent?.split(' ')[0]?.trim()
  const rest = messageContent?.slice(config.length + 1)

  switch (config) {
    case CONFIG_ROLES.adminRoles: return ConfigService.setAdminRoles(ctx, rest)
    case CONFIG_ROLES.over18Role: return ConfigService.setOver18Role(ctx, rest)
    case CONFIG_ROLES.under18Role: return ConfigService.setUnder18Role(ctx, rest)
    default: return message.reply(
      `Please provide a valid config key: \`\`\`${botPrefix}config ${CONFIGS.roles} [${CONFIG_ROLES_.join('|')}] ...\`\`\``,
    )
  }
}
