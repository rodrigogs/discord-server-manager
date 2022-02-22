import textValidator from './_text.mjs'

export default (channelName) => (message) =>
  textValidator({ exact: channelName })(message.channel.name)
