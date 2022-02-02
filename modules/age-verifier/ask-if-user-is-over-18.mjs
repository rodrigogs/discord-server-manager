import { AGE_VERIF_OVER_18_ROLE, AGE_VERIF_UNDER_18_ROLE } from '../../config.mjs'

export default async (member) => {
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
      return true
    case reactionButtons.deny:
      await member.roles.add(under18role, 'User said they are under 18')
      await member.send('You have been added to the server as an underage user 👼')
      return false
  }
}
