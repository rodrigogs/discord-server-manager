import { parse, isValid, differenceInYears } from 'date-fns'
import { AGE_VERIF_UNDER_18_ROLE } from '../../config.mjs'

const askForDateOfBirth = async (client, member) => {
  await member.send('Please enter your date of birth in the following format: YYYY-MM-DD')

  const message = await new Promise((resolve) => client.on('messageCreate', (message) => {
    if (message.author.id !== member.id) return
    client.removeAllListeners('messageCreate')
    resolve(message)
  }))

  const dateOfBirth = message.content

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
    await member.send('You are not over 18, let me fix that for you. I\'m adding you to the server as an underage user')
    await member.roles.remove(over18role, 'User age of birth was under 18')
    await member.roles.add(under18role, 'User age of birth was under 18')
  }
}

export default askForDateOfBirth
