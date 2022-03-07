import textValidator from './_text.mjs'

export default (guildName) => ({ message }) =>
  textValidator({ exact: guildName })(message.guild.name)
