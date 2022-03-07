import textValidator from '../messages/_text.mjs'

export default (guildId) => ({ member }) =>
  textValidator({ exact: guildId })(member.guild.id)
