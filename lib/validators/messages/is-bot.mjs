export default (predicate = true) => ({ message }) => {
  const isBot = !!message.author.bot
  return predicate === isBot
}
