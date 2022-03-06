export default class BaseService {
  static findRoleId (guildRoles, roleName) {
    return guildRoles.find(r => r.name === roleName)?.id
  }

  static createGuildKey (guild, config) {
    return `${guild.id}-${config}`
  }

  static createCurstomId (ctx, key) {
    const { message, interaction, member } = ctx
    let guild
    let channel
    let user

    if (message) {
      guild = message.guild
      channel = message.channel
      user = message.author
      if (!channel) {
        // So it is a DM
        return `${key}§user§${user.id}`
      }
      return `${key}§guild§${guild.id}§channel§${channel.id}§user§${user.id}`
    } else if (interaction) {
      guild = interaction.guild
      channel = interaction.channel
      user = interaction.user
      return `${key}§guild§${guild.id}§channel§${channel.id}§user§${user.id}`
    } else if (member) {
      guild = member.guild
      user = member.user
      return `${key}§guild§${guild.id}§user§${user.id}`
    } else {
      throw new Error('Invalid context object')
    }
  }
}
