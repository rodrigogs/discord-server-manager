import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import BaseService from './base.mjs'
import ConfigService from './config.mjs'

export default class AgeVerificationService extends BaseService {
  static async verifyAge (ctx) {
    const { member } = ctx

    const embedMessage = new MessageEmbed()
      .setTitle('Age Verification')
      .setDescription('Are you 18+?')
      .setColor('#0099ff')

    const confirmButton = new MessageButton('Confirm')
      .setCustomId(this.createCurstomId(ctx, 'verify-age-confirm-btn'))
      .setStyle('PRIMARY')
      .setLabel('I am 18+') // FIXME replace with configurable text
      .setEmoji('✅')

    const denyButton = new MessageButton('Deny')
      .setCustomId(this.createCurstomId(ctx, 'verify-age-deny-btn'))
      .setStyle('SECONDARY')
      .setLabel('I am not 18+') // FIXME replace with configurable text
      .setEmoji('❌')

    const actionRow = new MessageActionRow()
      .addComponents(confirmButton, denyButton)

    await member.send({ embeds: [embedMessage], components: [actionRow] })
  }

  static async recycleInteraction (interaction) {
    const embedMessage = new MessageEmbed()
      .setTitle('Age Verification')
      .setDescription('Thank you 🤖')
      .setColor('#0099ff')
    await interaction.update({ embeds: [embedMessage] })
    setTimeout(() => {
      interaction.deleteReply()
    }, 5000)
  }

  static async giveOver18MemberRole (ctx, interaction) {
    const { member } = ctx
    const role = await ConfigService.getOver18Role(ctx)
    if (!role) return member.send('No 18+ role found in the config. Try `!help` to see how to set one.')
    await member.roles.add(role)
    await member.send('With great power comes great responsibility.\nA 18+ role was added to your account.')
    await this.recycleInteraction(interaction)
  }

  static async giveUnder18MemberRole (ctx, interaction) {
    const { member } = ctx
    const role = await ConfigService.getUnder18Role(ctx)
    if (!role) return member.send('No 18+ role found in the config. Try `!help` to see how to set one.')
    await member.roles.add(role)
    await member.send('A 18- role was added to your account.')
    await this.recycleInteraction(interaction)
  }

  static confirmAge (ctx) {
    return new Promise((resolve) => {
      const { discordClient } = ctx

      discordClient.once('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId === this.createCurstomId(ctx, 'verify-age-confirm-btn')) {
          await this.giveOver18MemberRole(ctx, interaction)
          resolve()
        }
        if (interaction.customId === this.createCurstomId(ctx, 'verify-age-deny-btn')) {
          await this.giveUnder18MemberRole(ctx, interaction)
          resolve()
        }
      })
    })
  }

  /**
   * Ask users to verify their age
   * @param {Object} ctx
   */
  static async verifyMemberAge (ctx) {
    await this.verifyAge(ctx)
    await this.confirmAge(ctx)
  }
}
