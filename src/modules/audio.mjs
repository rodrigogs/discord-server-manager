import axios from 'axios'
import isBot from 'main/validators/messages/is-bot.mjs'

export default [
  {
    name: 'Download and play',
    description: 'Download and play a song',
    command: ['download-and-play', 'dap'],
    validator: [isBot(false)],
    processor: async (ctx, songUrl) => {
      const { message } = ctx
      const { voiceChannel } = message.member
      if (!voiceChannel) return await message.reply('You need to be in a voice channel to use this command')

      await message.reply(`Downloading ${songUrl}...`)
      const connection = await voiceChannel.join()

      const dispatcher = connection.play(await axios.get(songUrl, { responseType: 'arraybuffer' }).then(res => res.data))
      dispatcher.on('finish', () => {
        voiceChannel.leave()
      })
    },
  },
]
