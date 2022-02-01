import { parse, isValid, differenceInYears } from 'date-fns'
import { AGE_VERIF_OVER_18_ROLE, AGE_VERIF_UNDER_18_ROLE } from '../config.mjs'

const askIf18Plus = async (member) => {
  await member.send('This is an adult server, in order to join you must be 18 years old or older.')

  const reactionButtons = {
    confirm: '✅',
    deny: '❌',
  }

  const message = await member.send('Are you 18 years old or older?')
  await Promise.all([
    await message.react(reactionButtons.confirm),
    await message.react(reactionButtons.deny),
  ])

  const filter = (reaction, user) => [reactionButtons.confirm, reactionButtons.deny]
    .includes(reaction.emoji.name) && user.id === member.id

  const collector = message.createReactionCollector({ filter, max: 1 })
  const reaction = await new Promise((resolve) => collector.once('collect', resolve))

  const guild = member.guild
  const over18role = guild.roles.cache.find((role) => role.name === AGE_VERIF_OVER_18_ROLE)
  const under18role = guild.roles.cache.find((role) => role.name === AGE_VERIF_UNDER_18_ROLE)

  if (!over18role || !under18role) {
    console.error('Could not find roles')
    return
  }

  switch (reaction.emoji.name) {
    case reactionButtons.confirm:
      await member.roles.add(over18role, 'User said they are over 18')
      await member.send('You have been added to the server')
      return true
    case reactionButtons.deny:
      await member.roles.add(under18role, 'User said they are under 18')
      await member.send('You have been added to the server as an underage user')
      return false
  }
}

const askForDateOfBirth = async (client, member) => {
  await member.send('Please enter your date of birth in the following format: YYYY-MM-DD')

  const message = await new Promise((resolve) => client.on('messageCreate', (message) => {
    if (message.author.id !== member.id) return
    client.removeAllListeners('messageCreate')
    resolve(message)
  }))

  const dateOfBirth = message.content
  const userTag = `${member.user.username}#${member.user.discriminator}`
  console.log(`User ${userTag} entered ${dateOfBirth}`)

  if (!isValid(parse(dateOfBirth, 'yyyy-MM-dd', new Date()))) {
    await member.send('Invalid date of birth')
    return askForDateOfBirth(client, member)
  }

  const birtDate = parse(dateOfBirth, 'yyyy-MM-dd', new Date())
  const isBirtDateOver18 = differenceInYears(new Date(), birtDate) >= 18

  if (!isBirtDateOver18) {
    const guild = member.guild
    const over18role = guild.roles.cache.find((role) => role.name === AGE_VERIF_UNDER_18_ROLE)
    const under18role = guild.roles.cache.find((role) => role.name === AGE_VERIF_UNDER_18_ROLE)
    await member.send('You are not over 18, I\'ll fix that for you')
    await member.roles.remove(over18role, 'User age of birth was under 18')
    await member.roles.add(under18role, 'User age of birth was under 18')
  }
}

const onGuilMemberAdd = (client, guild) => async (member) => {
  if (member.user.bot) return
  if (guild.name !== member.guild.name) return

  const userTag = `${member.user.username}#${member.user.discriminator}`
  console.log(`User ${userTag} joined the server`)
  await member.send(`Hi ${userTag} welcome to the server ${member.guild.name}`)

  const is18Plus = await askIf18Plus(member)
  if (is18Plus) await askForDateOfBirth(client, member)

  await member.send('You\'re good to go!')
  await member.send('Don\'t forget to check out the #rules channel for more information')
}

export default (client) => {
  const guilds = client.guilds.cache
  for (const guild of guilds.values()) {
    console.log(`Starting age verifier for server ${guild.name}...`)
    client.on('guildMemberAdd', onGuilMemberAdd(client, guild))
  }
}
