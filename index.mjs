import { Client, Intents } from 'discord.js'
import { TOKEN, AGE_VERIF_ENABLED } from './config.mjs'
import { init, ageVerifier } from './modules/index.mjs'

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.login(TOKEN)

const keepPromiseAlive = async (promiseFn, args) => {
  try {
    await promiseFn(args)
  } catch (err) {
    console.error(err)
    return keepPromiseAlive(promiseFn, args)
  }
}

init(client)
  .then(() => {
    console.log('Bot is ready!')
    return Promise.all([
      AGE_VERIF_ENABLED && keepPromiseAlive(ageVerifier, client),
    ])
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
