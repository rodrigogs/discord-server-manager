import { CONFIGS_PARTITION, CONFIGS, CONFIG_CHANNELS, CONFIG_ROLES } from 'main/modules/config/_constants.mjs'
import { store } from 'main/store/index.mjs'

const code = (str) => `\`\`\`${str}\`\`\``

const guildKey = (config, guildId) => `${config}-${guildId}`

const getBotAdminRoles = (roles) => roles.split(',').map(role => role.trim())
const getBotAdminRolesIds = (guildRoles, roles) => getBotAdminRoles(roles)
  .map(role => guildRoles.find(r => r.name === role)?.id)
  .filter(id => !!id)

export default class ConfigService {
  /**
   * @param {Object} ctx
   * @param {String} [prefix='!']
   */
  static async setBotCommandsPrefix (ctx, prefix = '!') {
    if (!prefix || prefix.length === 0) throw new Error('Prefix cannot be empty')

    const { message } = ctx
    const guild = message.channel.guild
    const key = guildKey(CONFIG_CHANNELS.BOT_PREFIX, guild.id)
    await store.set(CONFIGS_PARTITION, key, prefix)
    await message.reply(`Bot commands prefix set to: ${prefix}`)
  }

  /**
   * @param {import('discord.js').Message} message
   * @returns {Promise<import('discord.js').Role[]>}
   */
  static async getBotCommandsPrefix (message) {
    const guild = message.channel.guild
    const prefix = guild && await store.get(CONFIGS_PARTITION, guildKey(CONFIG_CHANNELS.BOT_PREFIX, guild.id))
    return prefix || '!'
  }

  /**
   * @param {Object} ctx
   * @param {String} channels
   */
  static async setCommandChannels (ctx, channels) {
    const { message } = ctx
    const guild = message.channel.guild
    const guildChannels = guild.channels.cache
    const channelsArr = channels.split(',').map(channel => channel.trim())
    const botCommandsChannelIds = channelsArr.map(channel => guildChannels.find(c => c.name === channel)?.id)

    if (botCommandsChannelIds.length === 0) {
      const guildChannelNames = guildChannels.map(c => c.name).join(', ')
      return message.reply(
          `Please provide a valid channel name: ${code(`${ctx.botPrefix}config ${CONFIGS.CHANNELS} ${CONFIG_CHANNELS.BOT_COMMANDS_CHANNELS} [${guildChannelNames}]`)}`,
      )
    }

    const key = guildKey(CONFIG_ROLES.BOT_COMMANDS_CHANNELS, guild.id)
    await store.set(CONFIGS_PARTITION, key, botCommandsChannelIds)
    await message.reply(`Bot commands channel set to: ${botCommandsChannelIds.join(', ')}`)
  }

  /**
   * @param {Object} ctx
   * @returns {Promise<import('discord.js').Channel>}
   */
  static async getCommandChannels (ctx) {
    const { message } = ctx
    const guild = message.channel.guild
    const botCommandsChannelId = await store.get(CONFIGS_PARTITION, guildKey(CONFIG_ROLES.BOT_COMMANDS_CHANNELS, guild.id))
    return botCommandsChannelId ? guild.channels.cache.get(botCommandsChannelId) : null
  }

  /**
   * @param {Object} ctx
   * @param {String} roles
   */
  static async setAdminRoles (ctx, roles) {
    const { message } = ctx
    const guild = message.channel.guild
    const guildRoles = guild.roles.cache
    const botAdminRoles = getBotAdminRoles(roles)
    const botAdminRoleIds = getBotAdminRolesIds(guildRoles, roles)

    if (botAdminRoleIds.length === 0) {
      const guildRoleNames = guildRoles.map(r => r.name).join(', ')
      return message.reply(
        `Please provide a valid role name: ${code(`${ctx.botPrefix}config ${CONFIGS.ROLES} ${CONFIG_ROLES.ADMIN_ROLES} [${guildRoleNames}]`)}`,
      )
    }

    const key = guildKey(CONFIG_ROLES.BOT_ADMIN_ROLES, guild.id)
    await store.set(CONFIGS_PARTITION, key, botAdminRoleIds)
    await message.reply(`Bot admin roles set to: ${botAdminRoles.join(', ')}`)
  }

  /**
   * @param {Object} ctx
   * @param {String} value
   * @returns {Promise<import('discord.js').Role[]>}
   */
  static async getAdminRoles (ctx) {
    const { message } = ctx
    const guild = message.channel.guild
    const guildRoles = guild.roles.cache
    const botAdminRoles = await store.get(CONFIGS_PARTITION, guildKey(CONFIG_ROLES.BOT_ADMIN_ROLES, guild.id))
    return botAdminRoles.map(roleId => guildRoles.find(r => r.id === roleId))
  }

  /**
   * setLogsChannel
   * @param {Object} ctx
   * @param {String} channel
   * @returns {Promise<void>}
   */
  static async setLogsChannel (ctx, channel) {
    const { message } = ctx
    const guild = message.channel.guild
    const guildChannels = guild.channels.cache
    const channelId = guildChannels.find(c => c.name === channel)?.id

    if (!channelId) {
      const guildChannelNames = guildChannels.map(c => c.name).join(', ')
      return message.reply(
        `Please provide a valid channel name: ${code(`${ctx.botPrefix}config ${CONFIGS.CHANNELS} ${CONFIG_CHANNELS.LOGS_CHANNEL} [${guildChannelNames}]`)}`,
      )
    }

    const key = guildKey(CONFIG_CHANNELS.LOGS_CHANNEL, guild.id)
    await store.set(CONFIGS_PARTITION, key, channelId)
    await message.reply(`Logs channel set to: ${channel}`)
  }
}
