export default (predicate = true) => (message) => {
  const isDM = message.channel.type === 'dm'
  return predicate === isDM
}
