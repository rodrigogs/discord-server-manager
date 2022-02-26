import textValidator from './_text.mjs'

export default (guildId) => ({ message }) =>
  textValidator({ exact: guildId })(message.guild.id)
