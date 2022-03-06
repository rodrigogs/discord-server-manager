import { CONFIGS_PARTITION, CONFIGS, CONFIG_CHANNELS, CONFIG_ROLES } from 'main/commands/config/_constants.mjs'
import { store } from 'main/store/index.mjs'
import BaseService from './base.mjs'

const DEFAULT_PREFIX = '!'

const code = (str) => `\`\`\`${str}\`\`\``

const getBotAdminRoles = (roles) => roles.split(',').map(role => role.trim())
const getBotAdminRolesIds = (guildRoles, roles) => getBotAdminRoles(roles)
  .map(role => guildRoles.find(r => r.name === role)?.id)
  .filter(id => !!id)

export default class ConfigService extends BaseService {
  /**
   * @param {Object} ctx
   * @param {String} [prefix='!']
   */
  static async setBotCommandsPrefix (ctx, prefix = DEFAULT_PREFIX) {
    if (!prefix || prefix.length === 0) return ctx.message.reply('Please provide a valid prefix')

    const { message } = ctx
    const guild = message.channel.guild
    const key = this.createGuildKey(guild, CONFIGS.botPrefix)
    await store.set(CONFIGS_PARTITION, key, prefix)
    await message.reply(`Bot commands prefix set to: ${prefix}`)
  }

  /**
   * @param {import('discord.js').Message} message
   * @returns {Promise<import('discord.js').Role[]>}
   */
  static async getBotCommandsPrefix (message) {
    const guild = message.channel.guild
    if (!guild || !guild.id) return DEFAULT_PREFIX
    const key = this.createGuildKey(guild, CONFIGS.botPrefix)
    let prefix = guild && await store.get(CONFIGS_PARTITION, key)
    // Replace _ with space
    if (prefix && prefix.endsWith('_')) prefix = prefix.slice(0, -1) + ' '
    return prefix || DEFAULT_PREFIX
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
          `Please provide a valid channel name: ${code(`${ctx.botPrefix}config ${CONFIGS.channels} ${CONFIG_CHANNELS.BOT_COMMANDS_CHANNELS} [${guildChannelNames}]`)}`,
      )
    }

    const key = this.createGuildKey(guild, CONFIG_ROLES.BOT_COMMANDS_CHANNELS)
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
    const botCommandsChannelId = await store.get(CONFIGS_PARTITION, this.createGuildKey(guild, CONFIG_ROLES.BOT_COMMANDS_CHANNELS))
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
        `Please provide a valid role name: ${code(`${ctx.botPrefix}config ${CONFIGS.roles} ${CONFIG_ROLES.adminRoles} [${guildRoleNames}]`)}`,
      )
    }

    const key = this.createGuildKey(guild, CONFIG_ROLES.BOT_ADMIN_ROLES)
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
    const botAdminRoles = await store.get(CONFIGS_PARTITION, this.createGuildKey(guild, CONFIG_ROLES.BOT_ADMIN_ROLES))
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
        `Please provide a valid channel name: ${code(`${ctx.botPrefix}config ${CONFIGS.channels} ${CONFIG_CHANNELS.logsChannel} [${guildChannelNames}]`)}`,
      )
    }

    const key = this.createGuildKey(guild, CONFIG_CHANNELS.logsChannel)
    await store.set(CONFIGS_PARTITION, key, channelId)
    await message.reply(`Logs channel set to: ${channel}`)
  }

  /**
   * @param {Object} ctx
   * @returns {Promise<import('discord.js').Channel>}
   */
  static async getLogsChannel (ctx) {
    const { message } = ctx
    const guild = message.channel.guild
    const channelId = await store.get(CONFIGS_PARTITION, this.createGuildKey(guild, CONFIG_CHANNELS.logsChannel))
    return channelId ? guild.channels.cache.get(channelId) : null
  }

  /**
   * Get the role for users who are 18-
   * @param {Object} ctx
   * @param {String} role
   */
  static async setUnder18Role (ctx, role) {
    const { message } = ctx

    const guild = message.channel.guild
    const guildRoles = guild.roles.cache

    const roleId = this.findRoleId(guildRoles, role)
    if (!roleId) {
      return message.reply('Role not found.')
    }

    const key = this.createGuildKey(guild, CONFIG_ROLES.under18Role)
    await store.set(CONFIGS_PARTITION, key, roleId)
    await message.reply(`Under 18 role set to: ${role}`)
  }

  /**
   * Get the role for users who are 18-
   * @param {Object} ctx
   * @returns {Promise<import('discord.js').Role>}
   */
  static async getUnder18Role (ctx) {
    const { member } = ctx
    const guild = member.guild
    const guildRoles = guild.roles.cache
    const key = this.createGuildKey(guild, CONFIG_ROLES.under18Role)
    const roleId = await store.get(CONFIGS_PARTITION, key)
    if (!roleId) return undefined
    return guildRoles.find(r => r.id === roleId)
  }

  /**
     * Set the role for users who are 18+
     * @param {Object} ctx
     * @param {String} role
     */
  static async setOver18Role (ctx, role) {
    const { message } = ctx

    const guild = message.channel.guild
    const guildRoles = guild.roles.cache

    if (!role || !role.length) {
      const guildRoleNames = guildRoles.map(r => r.name).join(', ')
      return message.reply(
        `Please provide a valid role name: ${code(`${ctx.botPrefix}config ${CONFIGS.roles} ${CONFIG_ROLES.adminRoles} [${guildRoleNames}]`)}`,
      )
    }

    const roleId = this.findRoleId(guildRoles, role.trim())
    if (!roleId) {
      return message.reply('Role not found.')
    }

    const key = this.createGuildKey(guild, CONFIG_ROLES.over18Role)
    await store.set(CONFIGS_PARTITION, key, roleId)
    await message.reply(`Over 18 role set to: ${role}`)
  }

  /**
   * Get the role for users who are 18+
   * @param {Object} ctx
   * @returns {Promise<import('discord.js').Role>}
   */
  static async getOver18Role (ctx) {
    const { member } = ctx
    const guild = member.guild
    const guildRoles = guild.roles.cache
    const key = this.createGuildKey(guild, CONFIG_ROLES.over18Role)
    const roleId = await store.get(CONFIGS_PARTITION, key)
    if (!roleId) return undefined
    return guildRoles.find(r => r.id === roleId)
  }
}
