export default (predicate = true) => ({ message }) => {
  const isGuild = !!message.guildId
  return predicate === isGuild
}
