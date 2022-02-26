import isBot from 'main/validators/messages/is-bot.mjs'
import logger from 'main/logger.mjs'
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
} from '@discordjs/voice'
import ytdl from 'ytdl-core'
import MessageRule from 'main/router/message-rule.mjs'

export default [
  new MessageRule({
    name: 'Download and play',
    description: 'Download and play a song',
    command: ['download-and-play', 'dap'],
    validator: [isBot(false)],
    processor: async (ctx, songUrl) => {
      const { message, discordClient } = ctx
      const { member } = message

      if (!member) {
        return await message.reply('You need to be in a voice channel to use this command')
      }

      const channel = member.voice.channel
      const guild = channel.guild

      let connection = getVoiceConnection(guild.id)
      connection = connection || joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        debug: true,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      })

      connection.on('stateChange', (oldState, newState) => {
        logger.debug(`Voice connection transitioned from ${oldState.status} to ${newState.status}`)
      })

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      })

      player.on('stateChange', (oldState, newState) => {
        logger.debug(`Audio player transitioned from ${oldState.status} to ${newState.status}`)
      })

      const ytReadable = ytdl(songUrl, {
        filter: 'audioonly',
        quality: 'highestaudio',
        begin: 0,
      })

      const resource = createAudioResource(ytReadable, {
        inlineVolume: true,
      })

      connection.on(VoiceConnectionStatus.Ready, async () => {
        player.play(resource)
        connection.subscribe(player)

        player.on(AudioPlayerStatus.Idle, () => {
          connection.disconnect()
        })
      })

      discordClient.on('voiceStateUpdate', (oldState, newState) => {
        logger.debug(oldState, newState)
      })
    },
  }),
]
