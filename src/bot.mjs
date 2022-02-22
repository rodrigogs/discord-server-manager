import { Client, Intents } from 'discord.js'
import { DISCORD_BOT_TOKEN } from './config.mjs'
import init from './init.mjs'
import configure from './configure.mjs'

const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.login(DISCORD_BOT_TOKEN)

export default async () => {
  await init(client)
  await configure(client)
}
