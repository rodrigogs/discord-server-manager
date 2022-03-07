import { PassThrough } from 'stream'
import ytdl from 'ytdl-core'
import youtubeSearchApi from 'youtube-search-api'
import isBot from 'lib/validators/messages/is-bot.mjs'
import logger from 'lib/logger.mjs'
import MessageRule from 'lib/router/message-rule.mjs'
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
} from '@discordjs/voice'

const createYoutubeStream = (info, format, options, chunkSize = 512 * 1024) => {
  const stream = new PassThrough()
  let current = -1
  const contentLength = Number(format.contentLength)
  if (contentLength < chunkSize) {
    // stream is tiny so unnecessary to split
    ytdl.downloadFromInfo(info, { format, ...options }).pipe(stream)
  } else {
    // stream is big so necessary to split
    const pipeNextStream = () => {
      current++
      let end = chunkSize * (current + 1) - 1
      if (end >= contentLength) end = undefined
      const nextStream = ytdl.downloadFromInfo(info, {
        format,
        ...options,
        range: {
          start: chunkSize * current, end,
        },
      })
      nextStream.pipe(stream, { end: end === undefined })
      if (end !== undefined) {
        // schedule to pipe next partial stream
        nextStream.on('end', () => {
          pipeNextStream()
        })
      }
    }
    pipeNextStream()
  }
  return stream
}

const getYoutubeResource = async (message, search) => {
  const searchResults = await youtubeSearchApi.GetListByKeyword(search, false, 1)
  if (!searchResults.items.length) {
    return await message.reply('No results found')
  }

  const videoLink = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`
  const videoInfo = await ytdl.getInfo(videoLink)

  const ytReadable = createYoutubeStream(videoInfo, ytdl.filterFormats(videoInfo.formats, 'audioonly')[0], {
    filter: 'audioonly',
  })

  const resource = createAudioResource(ytReadable, {
    inlineVolume: true,
  })

  return resource
}

const players = {}

export default [
  new MessageRule({
    name: 'Play music',
    description: 'Search and play music from youtube',
    command: ['play', 'p'],
    validator: [isBot(false)],
    processor: async (ctx, search) => {
      const { message, discordClient } = ctx
      const { member } = message

      if (!member) {
        return await message.reply('You need to be in a voice channel to use this command')
      }

      const channel = member.voice.channel
      if (!channel) {
        return await message.reply('You need to be in a voice channel to use this command')
      }

      const guild = channel.guild

      let connection = getVoiceConnection(guild.id)
      if (connection) connection.rejoin()

      connection = connection || joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        debug: true,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      })

      const playerKey = `${guild.id}-${channel.id}`
      players[playerKey] = players[playerKey] || createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      })
      const player = players[playerKey]
      if (player.state.status === AudioPlayerStatus.Playing) {
        await player.stop()
      }

      player.on('stateChange', (oldState, newState) => {
        logger.debug(`Audio player transitioned from ${oldState.status} to ${newState.status}`)
      })

      let alreadyPlaying = false
      connection.on('stateChange', async (oldState, newState) => {
        logger.debug(`Voice connection transitioned from ${oldState.status} to ${newState.status}`)
        if (newState.status === VoiceConnectionStatus.Ready) {
          if (alreadyPlaying) {
            return
          }

          logger.debug('Ready to play')

          const resource = await getYoutubeResource(message, search)
          player.play(resource)
          connection.subscribe(player)

          alreadyPlaying = true

          player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect()
          })

          player.on('error', (err) => {
            logger.error('Error playing music: ', err)
            connection.disconnect()
          })
        }
      })

      discordClient.on('voiceStateUpdate', (oldState, newState) => {
        logger.debug(JSON.stringify({ oldState, newState }))
      })
    },
  }),
  new MessageRule({
    name: 'Stop music',
    description: 'Stop playing music',
    command: ['stop', 's'],
    validator: [isBot(false)],
    processor: async (ctx) => {
      const { message } = ctx
      const { member } = message

      if (!member) {
        return await message.reply('You need to be in a voice channel to use this command')
      }

      const channel = member.voice.channel
      const guild = channel.guild

      const connection = getVoiceConnection(guild.id)

      if (!connection) {
        return await message.reply('I am not connected to a voice channel')
      }

      connection.disconnect()
    },
  }),
]
