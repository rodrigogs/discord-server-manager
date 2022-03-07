import textValidator from './_text.mjs'

export default (channelId) => ({ message }) =>
  textValidator({ exact: channelId })(message.channel.id)
