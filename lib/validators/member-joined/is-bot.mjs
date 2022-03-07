const defaultOptions = {
  shouldBeABot: false,
}

export default (options = defaultOptions) => ({ member }) => {
  const {
    shouldBeABot,
  } = options

  const isBot = member.user.bot
  if (shouldBeABot) {
    return !!isBot
  }

  return !isBot
}
