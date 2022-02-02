import askIfUserIsOver18 from './ask-if-user-is-over-18.mjs'
import askForDateOfBirth from './ask-for-date-of-birth.mjs'

export default (client, guild) => async (member) => {
  if (member.user.bot) return
  if (guild.name !== member.guild.name) return

  const userTag = `${member.user.username}#${member.user.discriminator}`
  console.log(`User ${userTag} joined the server ${guild.name}`)
  await member.send(`Hi ${userTag} welcome to the server ${member.guild.name}`)

  const is18Plus = await askIfUserIsOver18(member)
  if (is18Plus) await askForDateOfBirth(client, member)

  await member.send('You\'re good to go!')
  await member.send('Don\'t forget to check out the #rules channel for more information')
}
