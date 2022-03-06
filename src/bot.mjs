import { Client, Intents } from 'discord.js'
import { DISCORD_BOT_TOKEN } from './config.mjs'
import init from './init.mjs'
import configure from './configure.mjs'
import logger from './logger.mjs'

const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_WEBHOOKS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.login(DISCORD_BOT_TOKEN)

export default async () => {
  logger.debug('Initializing...')
  await init(client)
  logger.debug('Configuring...')
  await configure(client)
}
